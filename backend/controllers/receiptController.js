const pool = require("../config/db");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const getReceiptDates = async (req, res) => {
    try{
        const token = req.cookies.token;
        if (!token) {
          return res.status(401).json({ error: "No token provided " });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const posId = decodedToken.pos_id;
        const { rows } = await pool.query(
            "SELECT DATE(date_created) AS date_created FROM receipts WHERE pos_id = $1 GROUP BY DATE(date_created)", 
            [posId.toString()]);
        res.json({ dates: rows });
    }
    catch(err) {
        res.status(500).json({ error: err.message });
    }
}

const getPosReceipts = async (req, res) => {
    try {
        const { startDate } = req.params;
        const token = req.cookies.token;
        if (!token) {
          return res.status(401).json({ error: "No token provided " });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const posId = decodedToken.pos_id;
        const { rows } = await pool.query(
            "SELECT R.receipt_name, R.receipt_total_cost, R.receipt_paid_amount, R.receipt_change, R.sale_id, P.pos_name, R.date_created FROM receipts R JOIN pos_users P ON R.pos_id = P.pos_id WHERE R.pos_id = $1 AND DATE(R.date_created) = $2 ORDER BY R.date_created DESC", 
            [posId.toString(), startDate]);
        
        res.json({ receipts: rows });
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

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const posId = decodedToken.pos_id;
        const { rows } = await pool.query(
            "SELECT I.item_name, SI.item_qty, SI.item_unit_price, SI.item_total_price FROM sales_items SI JOIN items I ON SI.item_id = I.item_id WHERE SI.pos_id = $1 AND SI.sale_id = $2", 
            [posId.toString(), receiptSaleId]);
        res.json({ items: rows });
    }
    catch(err) {
        res.status(500).json({ error: err.message });
    }
}

const getReceiptMechanics = async(req, res) => {
    try {
        const { receiptSaleId } = req.params;
        const token = req.cookies.token;
        if (!token) {
          return res.status(401).json({ error: "No token provided " });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const posId = decodedToken.pos_id;
        const { rows } = await pool.query(
            "SELECT M.mechanic_name, SM.service_price FROM sales_mechanics SM JOIN mechanics M ON SM.mechanic_id = M.mechanic_id WHERE SM.pos_id = $1 AND SM.sale_id = $2", 
            [posId.toString(), receiptSaleId]);
        res.json({ mechanics: rows });
    }
    catch(err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
  getPosReceipts,
  getReceiptItems,
  getReceiptMechanics,
  getReceiptDates
};