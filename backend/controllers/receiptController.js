const pool = require("../config/db");
const jwt = require("jsonwebtoken");

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
                "SELECT DATE(date_created) AS date_created FROM receipts GROUP BY DATE(date_created)");
            res.json({ dates: rows });
        } else {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const posId = decodedToken.pos_id;
            const { rows } = await pool.query(
                "SELECT DATE(date_created) AS date_created FROM receipts WHERE pos_id = $1 GROUP BY DATE(date_created)", 
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
                SELECT R.receipt_id, R.receipt_name, R.receipt_total_cost, R.receipt_paid_amount, R.receipt_change, R.sale_id, P.pos_name, R.date_created,  R.date_updated, R.status
                FROM receipts R
                JOIN pos_users P
                ON R.pos_id = P.pos_id
                WHERE DATE(R.date_created) = $1
                ORDER BY R.date_created DESC
            `;
            const { rows } = await pool.query(query, [startDate]);
            res.json({ receipts: rows, role: role });
        } else {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const posId = decodedToken.pos_id;
            const query = `
                SELECT R.receipt_id, R.receipt_name, R.receipt_total_cost, R.receipt_paid_amount, R.receipt_change, R.sale_id, P.pos_name, R.date_created, R.date_updated, R.status
                FROM receipts R JOIN pos_users 
                P ON R.pos_id = P.pos_id 
                WHERE R.pos_id = $1 AND DATE(R.date_created) = $2 
                ORDER BY R.date_created DESC
            `;
            const { rows } = await pool.query(query,
                [posId.toString(), startDate]);
            console.log('Role will be sent: ' , role)
            res.json({ receipts: rows, role: role });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
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
            SELECT I.item_id, I.item_name as item_name, SI.item_qty as qty, SI.item_unit_price as item_unit_price , SI.item_total_price as item_total_price, 'item' as record_type, stock_count as item_stock_count
            FROM sales_items SI 
            JOIN items I ON SI.item_id = I.item_id 
            WHERE SI.sale_id = $1
                UNION
            SELECT M.mechanic_id, M.mechanic_name as item_name, '1' as qty, SM.service_price as item_unit_price, SM.service_price as item_total_price, 'mechanic' as record_type, '1' as item_stock_count
            FROM sales_mechanics SM 
            JOIN mechanics M ON SM.mechanic_id = M.mechanic_id 
            WHERE SM.sale_id = $1
            ORDER BY item_name ASC;
        `;

        const { rows } = await pool.query(query, [receiptSaleId]);
        res.json({ items: rows });
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

        const query = `
            UPDATE receipts
            SET status = 'pending'
            WHERE receipt_id = $1
        `;

        await pool.query(query, [receiptId]);
        res.json({ status: "pending" });
        
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
        res.json({ status: "voided", dateVoided: new Date() });
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
        res.json({ status: "voided" });
        
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
  cancelVoidReceipt
};