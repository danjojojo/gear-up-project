const pool = require('../config/db');

const getSummaryRecords = async (req, res) => {
    try {
        const token = req.cookies.token;
        if(!token) return res.status(401).json({message: "Unauthorized"});

        const { date } = req.query;
        
        const getMechanicPercentage = `
            SELECT 
                setting_value
            FROM settings
            WHERE setting_key = 'mechanic_percentage';
        `;
        const value = await pool.query(getMechanicPercentage);
        const mechanicPercentage = value.rows[0].setting_value;
        
        const query = `
            SELECT 'items' as record_type, item_name, item_total_price, si.date_created as date, pos_name, s.sale_id as record_id, si.sale_item_id as record_item_id, si.refund_qty as refund_qty, si.item_qty as item_qty, item_unit_price, si.return_qty as return_qty 
                FROM sales_items SI 
                JOIN items I on SI.item_id = i.item_id
                JOIN sales S on SI.sale_id = s.sale_id
                JOIN pos_users P on SI.pos_id = p.pos_id
                WHERE DATE(si.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') = $1 AND s.status = true AND si.sale_item_type = 'sale'
            UNION
            SELECT 'mechanic' as record_type, mechanic_name, service_price, sm.date_created as date, pos_name, s.sale_id as record_id, sm.sale_service_id as record_item_id, '0' as refund_qty, '1' as item_qty, service_price as item_unit_price, '0' as return_qty
                FROM sales_mechanics SM 
                JOIN mechanics M on SM.mechanic_id = M.mechanic_id
                JOIN sales S on SM.sale_id = s.sale_id
                JOIN pos_users P on SM.pos_id = p.pos_id
                WHERE DATE(sm.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') = $1 AND s.status = true
            UNION
            SELECT 'expense' AS record_type, expense_name, expense_amount, e.date_created as date, pos_name, e.expense_id as record_id, e.expense_id as record_item_id, '0' as refund_qty, '1' as item_qty, expense_amount as item_unit_price, '0' as return_qty
                FROM expenses e JOIN pos_users P on e.pos_id = p.pos_id
                WHERE DATE(e.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') = $1 AND e.status = 'active'
                ORDER BY date DESC, item_name ASC;
        `
        const values = [date];
        const { rows } = await pool.query(query, values);
        res.json({ records: rows, mechanicPercentage });
        
    } catch (error) {
        res.status(500).json({message: "Error"});
    }
}

const getHighlightDates = async (req, res) => {
    try {
        const token = req.cookies.token;
        if(!token) return res.status(401).json({message: "Unauthorized"});

        const query = `
            SELECT DISTINCT date(si.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') as date, 'item' as record_type
            FROM sales_items SI 
            JOIN sales S on SI.sale_id = S.sale_id
            WHERE S.status = true
            UNION
            SELECT DISTINCT date(sm.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') as date, 'mechanic' as record_type
            FROM sales_mechanics SM
            JOIN sales S on SM.sale_id = S.sale_id
            WHERE S.status = true
            UNION
            SELECT DISTINCT date(date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') as date, 'expense' as record_type
            FROM expenses
            ORDER BY date DESC;
        `
        const { rows } = await pool.query(query);
        res.json({ dates: rows })
    } catch (error) {
        res.status(500).json({message: "Error"});
    }
}

const getReceiptDetails = async (req, res) => {
    try {
        const token = req.cookies.token;
        if(!token) return res.status(401).json({message: "Unauthorized"});

        const { saleId } = req.query;

        const query = `
            SELECT R.receipt_name, R.receipt_total_cost, R.receipt_paid_amount, R.receipt_change
            FROM receipts R 
            WHERE R.sale_id = $1 
        `

        const values = [saleId];

        const { rows } = await pool.query(query, values);
        const receiptDetails = rows[0];
        res.json({
            receiptName: receiptDetails.receipt_name,
            totalCost: receiptDetails.receipt_total_cost,
            paidAmount: receiptDetails.receipt_paid_amount,
            change: receiptDetails.receipt_change,
        })
    } catch (error) {
        res.status(500).json({message: "Error"});
    }
}

const getReceiptItems = async (req, res) => {
    try {
        const token = req.cookies.token;
        if(!token) return res.status(401).json({message: "Unauthorized"});

        const { saleId } = req.query;

        const query = `
            SELECT I.item_name as item_name, SI.item_qty as qty, SI.item_unit_price as item_unit_price , SI.item_total_price as item_total_price, 'item' as record_type, SI.refund_qty as refund_qty, si.return_qty as return_qty
            FROM sales_items SI 
            JOIN items I ON SI.item_id = I.item_id 
            WHERE SI.sale_id = $1
                UNION
            SELECT M.mechanic_name as item_name, '1' as qty, SM.service_price as item_unit_price, SM.service_price as item_total_price, 'mechanic' as record_type, '0' as refund_qty, '0' as return_qty
            FROM sales_mechanics SM 
            JOIN mechanics M ON SM.mechanic_id = M.mechanic_id 
            WHERE SM.sale_id = $1
            ORDER BY item_name ASC;
        `
        const values = [saleId];
        const { rows } = await pool.query(query, values);
        res.json({ items: rows })
    } catch (error) {
        res.status(500).json({message: "Error"});
    }
}

const getExpenseImage = async (req, res) => {
    try {
        const token = req.cookies.token;
        if(!token) return res.status(401).json({message: "Unauthorized"});

        const { expenseId } = req.query;

        const query = `
            SELECT encode(expense_image, 'base64') AS expense_image
            FROM expenses
            WHERE expense_id = $1
        `

        const values = [expenseId];
        const { rows } = await pool.query(query, values);
        const image = rows[0].expense_image;
        res.json({ image })
    } catch (error) {
        res.status(500).json({message: "Error"});
    }
}

module.exports = {
    getSummaryRecords,
    getHighlightDates,
    getReceiptDetails,
    getReceiptItems,
    getExpenseImage
}