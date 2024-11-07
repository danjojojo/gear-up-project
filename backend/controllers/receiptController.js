const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const {v4: uuidv4} = require("uuid");

require("dotenv").config();

const getReceiptDates = async (req, res) => {
    try{
        const token = req.cookies.token;
        const role = req.cookies.role;
        if (!token) {
          return res.status(401).json({ error: "No token provided " });
        }

        if(role === 'admin') {
            const { rows } = await pool.query(
                "SELECT DATE(date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') AS date_created FROM receipts GROUP BY DATE(date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila')");
            res.json({ dates: rows });
        } else {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const posId = decodedToken.pos_id;
            const { rows } = await pool.query(
                "SELECT DATE(date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') AS date_created FROM receipts GROUP BY DATE(date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila')", 
                [posId.toString()]);
            res.json({ dates: rows });
        }
    }
    catch(err) {
        res.status(500).json({ error: err.message });
    }
}

const getPosReceipts = async (req, res) => {
    try {
        const { startDate } = req.params;
        const token = req.cookies.token;
        const role = req.cookies.role;
        console.log(role);
        if (!token) {
          return res.status(401).json({ error: "No token provided " });
        }

        if(role === 'admin') {
            const query = `
                SELECT R1.receipt_id, R1.receipt_name, R1.receipt_total_cost, R1.receipt_paid_amount, 
                    R1.receipt_change, R1.sale_id, P.pos_name, R1.date_created, R1.date_updated, 
                    R1.status, R1.receipt_type, R2.receipt_name AS original_receipt_name
                FROM receipts R1
                JOIN pos_users P ON R1.pos_id = P.pos_id
                LEFT JOIN receipts R2 ON R1.receipt_type = 'refund' AND R1.refund_id = R2.receipt_id
                WHERE DATE(R1.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') = $1 
                ORDER BY R1.date_created DESC;
            `;
            const { rows } = await pool.query(query, [startDate]);
            res.json({ receipts: rows, role: role });
        } else {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const posId = decodedToken.pos_id;
            const query = `
                SELECT R1.receipt_id, R1.receipt_name, R1.receipt_total_cost, R1.receipt_paid_amount, 
                    R1.receipt_change, R1.sale_id, P.pos_name, R1.date_created, R1.date_updated, 
                    R1.status, R1.receipt_type, R2.receipt_name AS original_receipt_name
                FROM receipts R1
                JOIN pos_users P ON R1.pos_id = P.pos_id
                LEFT JOIN receipts R2 ON R1.receipt_type = 'refund' AND R1.refund_id = R2.receipt_id
                WHERE R1.pos_id = $1 
                AND DATE(R1.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') = $2 
                ORDER BY R1.date_created DESC;
            `;
            const { rows } = await pool.query(query,
                [posId.toString(), startDate]);
            res.json({ receipts: rows });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getReceiptDetails = async(req, res) => {
    try {
        const { receiptSaleId } = req.params;
        const token = req.cookies.token;
        if (!token) {
          return res.status(401).json({ error: "No token provided " });
        }

        const query = `
            SELECT R1.receipt_id, R1.receipt_name, R1.receipt_total_cost, R1.receipt_paid_amount, 
                R1.receipt_change, R1.sale_id, P.pos_name, R1.date_created, R1.date_updated, 
                R1.status, R1.receipt_type, R2.receipt_name AS original_receipt_name
            FROM receipts R1
            JOIN pos_users P ON R1.pos_id = P.pos_id
            LEFT JOIN receipts R2 ON R1.receipt_type = 'refund' AND R1.refund_id = R2.receipt_id
            WHERE R1.sale_id = $1;
        `;
        const { rows } = await pool.query(query, [receiptSaleId]);
        res.json({ receipt: rows[0] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getReceiptItems = async(req, res) => {
    try {
        const { receiptSaleId } = req.params;
        const token = req.cookies.token;
        if (!token) {
          return res.status(401).json({ error: "No token provided " });
        }

        const query = `
            SELECT I.item_id, I.item_name as item_name, SI.item_qty as qty, SI.item_unit_price as item_unit_price , SI.item_total_price as item_total_price, 'item' as record_type, stock_count as item_stock_count, SI.refund_qty as refund_qty
            FROM sales_items SI 
            JOIN items I ON SI.item_id = I.item_id 
            WHERE SI.sale_id = $1
                UNION
            SELECT M.mechanic_id, M.mechanic_name as item_name, '1' as qty, SM.service_price as item_unit_price, SM.service_price as item_total_price, 'mechanic' as record_type, '1' as item_stock_count, '0' as refund_qty
            FROM sales_mechanics SM 
            JOIN mechanics M ON SM.mechanic_id = M.mechanic_id 
            WHERE SM.sale_id = $1
            ORDER BY item_name ASC;
        `;

        const { rows } = await pool.query(query, [receiptSaleId]);
        res.json({ items: rows, receiptItems : rows });
    }
    catch(err) {
        res.status(500).json({ error: err.message });
    }
}

const staffVoidReceipt = async(req, res) => {
    try {
        const { receiptId } = req.params;
        const token = req.cookies.token;
        if (!token) {
          return res.status(401).json({ error: "No token provided " });
        }

        const checkIfRefundsVoided = `
            SELECT COUNT(*)
                FROM receipts
            WHERE refund_id = $1 AND receipt_type = 'refund' AND status = 'active'; 
        `
        const { rows } = await pool.query(checkIfRefundsVoided, [receiptId]);

        if (rows[0].count > 0) {
            return res.json({ status: "error" });
        } 
        console.log('Void Receipt');
        const query = `
            UPDATE receipts
            SET status = 'pending', date_updated = NOW()
            WHERE receipt_id = $1
        `;

        await pool.query(query, [receiptId]);
        res.json({ status: "pending", dateRequested: new Date(Date.now()).toLocaleString("en-US", { timeZone: "Asia/Manila" }) });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const adminVoidReceipt = async(req, res) => {
    try {
        const { receiptId } = req.params;
        const { items } = req.body;
        console.log(items);
        const token = req.cookies.token;
        if (!token) {
          return res.status(401).json({ error: "No token provided " });
        }

        const checkIfRefundsVoided = `
            SELECT COUNT(*)
                FROM receipts
            WHERE refund_id = $1 AND receipt_type = 'refund' AND status = 'active'; 
        `
        const { rows } = await pool.query(checkIfRefundsVoided, [receiptId]);

        if (rows[0].count > 0) {
           return res.json({ status: "error" });
        }

        // Return items to stock
        let updateItemsStockCount = "UPDATE items SET stock_count = CASE item_id ";
        let updateItemsStockCountValues = [];
        let updateItemsStockCountWhereClause = "WHERE item_id IN (";

        await pool.query("BEGIN;");

        if (items.length > 0) {
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                
                updateItemsStockCount += `WHEN '${item.item_id}' THEN $${i + 1} `;
                updateItemsStockCountValues.push(item.item_stock_count + item.qty);

                updateItemsStockCountWhereClause += `'${item.item_id}'`;
                if (i != items.length - 1) {
                    updateItemsStockCountWhereClause += ", ";
                } else if (i == items.length - 1) {
                    updateItemsStockCountWhereClause += ")";
                    updateItemsStockCount += `ELSE stock_count END ${updateItemsStockCountWhereClause}`;
                }
            }
            // console.log(updateItemsStockCount, updateItemsStockCountValues);

            await pool.query(updateItemsStockCount, updateItemsStockCountValues);
        }
        const query = `
            UPDATE receipts
            SET status = 'voided', date_updated = NOW()
            WHERE receipt_id = $1
        `;
        const updateSalesIDtoFalse = `
            UPDATE sales
            SET status = false
            WHERE sale_id IN (
                SELECT sale_id
                FROM receipts
                WHERE receipt_id = $1
            );
        `;

        await pool.query(query, [receiptId]);
        await pool.query(updateSalesIDtoFalse, [receiptId]);
        await pool.query("COMMIT;");
        res.json({ status: "voided", dateVoided: new Date(Date.now()).toLocaleString("en-US", { timeZone: "Asia/Manila" }) });
    } catch (error) {
        await pool.query("ROLLBACK;");
        res.status(500).json({ message: error.message });
    }
}
 
const cancelVoidReceipt = async(req, res) => {
    try {
        const { receiptId } = req.params;
        const token = req.cookies.token;

        if (!token) {
          return res.status(401).json({ error: "No token provided " });
        }
        
        const query = `
            UPDATE receipts
            SET status = 'active', date_updated = NOW()
            WHERE receipt_id = $1
        `;
    
        await pool.query(query, [receiptId]);
        res.json({ status: "active" });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const refundReceipt = async(req, res) => {
    try {
        const token = req.cookies.token;
        const todayDate = new Date();
        if (!token) {
            return res.status(401).json({ error: "No token provided " });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        const { receiptId, receiptSaleId, refundData } = req.body;
        console.log(refundData);
        console.log(receiptId);
        let totalPrice = 0;
        for(let i = 0; i < refundData.length; i++){
            console.log(i, refundData[i].id, refundData[i].qty);
            totalPrice += refundData[i].qty * refundData[i].unit_price;
        }
        console.log(totalPrice);
        
        const originalReceiptID = receiptId;
        const saleID = "sale-" + uuidv4();
        const posId = decodedToken.pos_id;
        const receiptName = "REF-" + (todayDate.getMonth() + 1) + "" + todayDate.getDate() + "" + todayDate.getFullYear() + "-" + todayDate.getHours() + "" + todayDate.getMinutes() + "" + todayDate.getSeconds();
        const totalPriceRefunded = totalPrice;
        const amountReceived = totalPrice;
        const change = 0;
        const receiptType = 'refund';
        const saleItemType = 'refund';
        const refundReceiptID = "receipt-" + uuidv4();

        const insertSales = `
            INSERT INTO sales
            (sale_id, pos_id, sale_amount)
            VALUES
            ($1, $2, $3)
        `
        const insertSalesValues = [
            saleID, posId, totalPriceRefunded
        ]
        const insertRefundtoReceipts = `
            INSERT INTO receipts 
            (receipt_id, sale_id, pos_id, receipt_name, receipt_total_cost, receipt_paid_amount, receipt_change, receipt_type, refund_id)
            VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `
        const insertRefundtoReceiptsValues = [
            refundReceiptID, saleID, posId, receiptName, totalPriceRefunded, amountReceived, change, receiptType, originalReceiptID
        ]
        let insertIntoSalesItems =
        "INSERT INTO sales_items (sale_item_id, sale_id, pos_id, item_id, item_qty, item_unit_price, item_total_price, sale_item_type) VALUES ";

        let insertIntoSalesItemsValues = [];
        
        let updateItemsStockCount = "UPDATE items SET stock_count = CASE item_id ";
        let updateItemsStockCountValues = [];
        let updateItemsStockCountWhereClause = "WHERE item_id IN (";

        let updateSaleItemsRefundQty = "UPDATE sales_items SET refund_qty = CASE item_id ";
        let updateSaleItemsRefundQtyValues = [];
        let updateSaleItemsRefundQtyWhere1Clause = "WHERE item_id IN (";
        let updateSaleItemsRefundQtyWhere2Clause = "AND sale_id";

        for (let i = 0; i < refundData.length; i++) {
            let item = refundData[i];
            insertIntoSalesItems += `($${i * 8 + 1}, $${i * 8 + 2}, $${i * 8 + 3}, 
            $${i * 8 + 4}, $${i * 8 + 5}, $${i * 8 + 6}, $${i * 8 + 7}, $${i * 8 + 8})`;
            insertIntoSalesItemsValues.push(
            "sale-item-" + i + Date.now(),
                saleID,
                posId,
                item.id,
                item.qty,
                item.unit_price,
                item.qty * item.unit_price,
                saleItemType 
            );

            updateItemsStockCount += `WHEN '${item.id}' THEN $${i + 1} `;
            updateItemsStockCountValues.push(item.stock_count + item.qty);
            updateItemsStockCountWhereClause += `'${item.id}'`;

            updateSaleItemsRefundQty += `WHEN '${item.id}' THEN $${i + 1} `;
            updateSaleItemsRefundQtyValues.push(item.qty);
            updateSaleItemsRefundQtyWhere1Clause += `'${item.id}'`;

            if (i != refundData.length - 1) {
                insertIntoSalesItems += ", ";
                updateItemsStockCountWhereClause += ", ";
                updateSaleItemsRefundQtyWhere1Clause += ", ";
            } else if (i == refundData.length - 1) {
                updateItemsStockCountWhereClause += ")";
                updateItemsStockCount += `ELSE stock_count END ${updateItemsStockCountWhereClause}`;
                updateSaleItemsRefundQtyWhere1Clause += ")";
                updateSaleItemsRefundQty += `ELSE refund_qty END ${updateSaleItemsRefundQtyWhere1Clause} ${updateSaleItemsRefundQtyWhere2Clause} = $${i + 2}`;
                updateSaleItemsRefundQtyValues.push(receiptSaleId);
            }
        }

        console.log(insertIntoSalesItems, insertIntoSalesItemsValues);
        console.log(updateItemsStockCount, updateItemsStockCountValues);
        console.log(updateSaleItemsRefundQty, updateSaleItemsRefundQtyValues);

        // INSERT INTO SALES
        // INSERT INTO RECEIPTS
        // INSERT INTO SALES_ITEMS
        // UPDATE REFUND QTY OF THE ORIGINAL RECEIPT SALE_ID
        // UPDATE ITEMS STOCK COUNT

        await pool.query("BEGIN;");
        await pool.query(insertSales, insertSalesValues);
        await pool.query(insertRefundtoReceipts, insertRefundtoReceiptsValues);
        await pool.query(insertIntoSalesItems, insertIntoSalesItemsValues);
        await pool.query(updateItemsStockCount, updateItemsStockCountValues);
        await pool.query(updateSaleItemsRefundQty, updateSaleItemsRefundQtyValues);
        await pool.query("COMMIT;");

        res.json({ status: "Refund Successful" });
        console.log('received Refund Data');
    } catch (error) {
        await pool.query("ROLLBACK;");
        res.status(500).json({ message: error.message });
    }
}

const adminCancelRefundReceipt = async(req, res) => {
    try {
        const { receiptId } = req.params;
        const { items, originalReceiptName } = req.body;
        console.log(items);
        const token = req.cookies.token;
        if (!token) {
          return res.status(401).json({ error: "No token provided " });
        }
        console.log('Cancel Refund Receipt');
        console.log(receiptId);
        console.log(originalReceiptName);
        
        const findOriginalReceiptSaleId = `
            SELECT sale_id
            FROM sales_items
            WHERE sale_id IN (
                SELECT sale_id
                FROM receipts
                WHERE receipt_name = $1
            )
        `
        const { rows } = await pool.query(findOriginalReceiptSaleId, [originalReceiptName.toString()]);
        const receiptSaleId = rows[0].sale_id;

        let updateItemsStockCount = "UPDATE items SET stock_count = CASE item_id ";
        let updateItemsStockCountValues = [];
        let updateItemsStockCountWhereClause = "WHERE item_id IN (";

        let updateSaleItemsRefundQty = "UPDATE sales_items SET refund_qty = CASE item_id ";
        let updateSaleItemsRefundQtyValues = [];
        let updateSaleItemsRefundQtyWhere1Clause = "WHERE item_id IN (";
        let updateSaleItemsRefundQtyWhere2Clause = "AND sale_id";

        for (let i = 0; i < items.length; i++) {
            let item = items[i];

            updateItemsStockCount += `WHEN '${item.item_id}' THEN $${i + 1} `;
            updateItemsStockCountValues.push(item.item_stock_count - item.qty);
            updateItemsStockCountWhereClause += `'${item.item_id}'`;

            updateSaleItemsRefundQty += `WHEN '${item.item_id}' THEN refund_qty - $${i + 1} `;
            updateSaleItemsRefundQtyValues.push(Number(item.qty));
            updateSaleItemsRefundQtyWhere1Clause += `'${item.item_id}'`;

            if (i != items.length - 1) {
                updateItemsStockCountWhereClause += ", ";
                updateSaleItemsRefundQtyWhere1Clause += ", ";
            } else if (i == items.length - 1) {
                updateItemsStockCountWhereClause += ")";
                updateItemsStockCount += `ELSE stock_count END ${updateItemsStockCountWhereClause}`;
                updateSaleItemsRefundQtyWhere1Clause += ")";
                updateSaleItemsRefundQty += `ELSE refund_qty END ${updateSaleItemsRefundQtyWhere1Clause} ${updateSaleItemsRefundQtyWhere2Clause} = $${i + 2}`;
                updateSaleItemsRefundQtyValues.push(receiptSaleId);
            }
        }
        console.log(updateItemsStockCount, updateItemsStockCountValues);
        console.log(updateSaleItemsRefundQty, updateSaleItemsRefundQtyValues);
        const updateSalesIDtoFalse = `
            UPDATE sales
            SET status = false
            WHERE sale_id IN (
                SELECT sale_id
                FROM receipts
                WHERE receipt_id = $1
            );
        `;
        const updateReceiptToVoided = `
            UPDATE receipts
            SET status = 'voided', date_updated = NOW()
            WHERE receipt_id = $1
        `;
        await pool.query("BEGIN;");
        await pool.query(updateItemsStockCount, updateItemsStockCountValues);
        await pool.query(updateSaleItemsRefundQty, updateSaleItemsRefundQtyValues);
        await pool.query(updateReceiptToVoided, [receiptId]);
        await pool.query(updateSalesIDtoFalse, [receiptId]);
        await pool.query("COMMIT;");
        res.json({ status: "voided", dateVoided: new Date(Date.now()).toLocaleString("en-US", { timeZone: "Asia/Manila" }) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getReceiptsDashboard = async (req, res) => {
    try{ 
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: "No token provided " });
        }
        const { date } = req.query;
        const query = `
            SELECT 
                COUNT(CASE WHEN DATE(r.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') = $1 THEN receipt_id ELSE NULL END) as receipts_today,
                COUNT(CASE WHEN DATE(r.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') = $1 AND receipt_type = 'sale' THEN receipt_id ELSE NULL END) as sale_receipts_today,
                COUNT(CASE WHEN DATE(r.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') = $1 AND receipt_type = 'refund' THEN receipt_id ELSE NULL END) as refund_receipts_today,
                COUNT(CASE WHEN DATE(r.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') = $1 AND s.status = false THEN receipt_id ELSE NULL END) as cancelled_receipts_today,
                COUNT(receipt_id) as receipts_total,
                COUNT(CASE WHEN receipt_type = 'sale' THEN receipt_id ELSE NULL END) as sale_receipts_total,
                COUNT(CASE WHEN receipt_type = 'refund' THEN receipt_id ELSE NULL END) as refund_receipts_total,
                COUNT(CASE WHEN s.status = false THEN receipt_id ELSE NULL END) as cancelled_receipts_total
            FROM receipts R
            JOIN sales S ON R.sale_id = S.sale_id;
        `
        const values = [date];
        const { rows } = await pool.query(query, values);
        res.json({ dashboard: rows });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
  getPosReceipts,
  getReceiptItems,
  getReceiptDates,
  staffVoidReceipt,
  adminVoidReceipt,
  cancelVoidReceipt,
  refundReceipt,
  adminCancelRefundReceipt,
  getReceiptsDashboard,
  getReceiptDetails
};