const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const getAllItems = async (req,res) => {
    try {
      const { rows } = await pool.query("SELECT * FROM items WHERE status = true ORDER BY stock_count DESC");
      res.json({ items: rows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}

const getAllMechanics = async (req,res) => {
    try {
      const { rows } = await pool.query("SELECT * FROM mechanics WHERE status = true ORDER BY mechanic_name ASC");
      res.json({ mechanics: rows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}

const confirmSale = async (req, res) => {
  try {
    const {
      items,
      mechanics,
      totalPrice,
      amountReceived,
      change,
    } = req.body;
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "No token provided " });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const posId = decodedToken.pos_id;
    const todayDate = new Date();

    console.log("Request body:", req.body); // Log the entire request body
    console.log("POS ID:", posId);
    console.log("Items:", items);
    console.log("Mechanics:", mechanics);
    console.log("Total Price:", totalPrice);
    console.log("Amount Received:", amountReceived);
    console.log("Change:", change);

    const saleId = "sale-" + uuidv4();
    const receiptId = "receipt-" + uuidv4();
    const receiptName = "REC-" + (todayDate.getMonth() + 1) + "" + todayDate.getDate() + "" + todayDate.getFullYear() + "-" + todayDate.getHours() + "" + todayDate.getMinutes() + "" + todayDate.getSeconds();
    const receiptDate = todayDate.toLocaleString();

    let updateItemsStockCount = "UPDATE items SET stock_count = CASE item_id ";
    let updateItemsStockCountValues = [];
    let updateItemsStockCountWhereClause = "WHERE item_id IN (";

    let insertIntoSalesItems =
      "INSERT INTO sales_items (sale_item_id, sale_id, pos_id, item_id, item_qty, item_unit_price, item_total_price) VALUES ";
    let insertIntoSalesItemsValues = [];

    let insertIntoSalesMechanics =
      "INSERT INTO sales_mechanics (sale_service_id, sale_id, pos_id, mechanic_id, service_price) VALUES ";
    let insertIntoSalesMechanicsValues = [];

    await pool.query("BEGIN;");
    await pool.query(
      "INSERT INTO sales (sale_id, pos_id, sale_amount) VALUES ($1, $2, $3)",
      [saleId, posId, totalPrice]
    );
    await pool.query(
      "INSERT INTO receipts (receipt_id, sale_id, pos_id, receipt_name, receipt_total_cost, receipt_paid_amount, receipt_change) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [receiptId, saleId, posId, receiptName, totalPrice, amountReceived, change]
    );

    if (items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        insertIntoSalesItems += `($${i * 7 + 1}, $${i * 7 + 2}, $${i * 7 + 3}, 
        $${i * 7 + 4}, $${i * 7 + 5}, $${i * 7 + 6}, $${i * 7 + 7})`;
        insertIntoSalesItemsValues.push(
          "sale-item-" + i + Date.now(),
          saleId,
          posId,
          item.id,
          item.qty,
          item.price,
          item.total_price
        );

        updateItemsStockCount += `WHEN '${item.id}' THEN $${i + 1} `;
        updateItemsStockCountValues.push(item.stock_count - item.qty);

        updateItemsStockCountWhereClause += `'${item.id}'`;
        if (i != items.length - 1) {
          insertIntoSalesItems += ", ";
          updateItemsStockCountWhereClause += ", ";
        } else if (i == items.length - 1) {
          updateItemsStockCountWhereClause += ")";
          updateItemsStockCount += `ELSE stock_count END ${updateItemsStockCountWhereClause}`;
        }
      }
      console.log(updateItemsStockCount, updateItemsStockCountValues);
      console.log(insertIntoSalesItems, insertIntoSalesItemsValues);

      await pool.query(updateItemsStockCount, updateItemsStockCountValues);
      await pool.query(insertIntoSalesItems, insertIntoSalesItemsValues);
    }

    if (mechanics.length > 0) {
      for (let m = 0; m < mechanics.length; m++) {
        let mechanic = mechanics[m];
        insertIntoSalesMechanics += `(
          $${m * 5 + 1},
          $${m * 5 + 2}, 
          $${m * 5 + 3}, 
          $${m * 5 + 4}, 
          $${m * 5 + 5})
        `;
        insertIntoSalesMechanicsValues.push(
          "sale-mechanic-" + m + Date.now(),
          saleId,
          posId,
          mechanic.id,
          mechanic.price
        );
        if (m != mechanics.length - 1) {
          insertIntoSalesMechanics += ", ";
        }
      }
      console.log(insertIntoSalesMechanics, insertIntoSalesMechanicsValues);

      await pool.query(insertIntoSalesMechanics, insertIntoSalesMechanicsValues);
    }

    await pool.query("COMMIT;");
    res.status(201).json({ saleId, receiptName, receiptDate, posId });
  } catch (err) {
    await pool.query("ROLLBACK;");
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  getAllItems,
  getAllMechanics,
  confirmSale
};