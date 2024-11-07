const pool = require('../config/db');
require('dotenv').config();

// Get sales report data
const getSalesReport = async (req, res) => {
    const { month, year } = req.query;

    try {
        // Summary Query
        const summaryResult = await pool.query(
            `
            SELECT 
                i.item_name, 
                SUM(si.item_qty) AS quantity, 
                SUM(si.item_total_price) AS total_sales
            FROM sales_items si
            JOIN items i ON si.item_id = i.item_id
            JOIN receipts r ON si.sale_id = r.sale_id
            LEFT JOIN receipts r_refund ON r.sale_id = r_refund.sale_id AND r_refund.receipt_type = 'refund'
            WHERE 
                EXTRACT(MONTH FROM r.date_created) = $1 
                AND EXTRACT(YEAR FROM r.date_created) = $2
                AND r_refund.sale_id IS NULL -- Ensure only sales without refunds are included
            GROUP BY i.item_name
            ORDER BY total_sales DESC;
            `,
            [month, year]
        );

        // Detailed Query
        const detailedResult = await pool.query(
            `
            SELECT 
                EXTRACT(DAY FROM r.date_created) AS day,
                i.item_name, 
                SUM(si.item_qty) AS quantity, 
                AVG(si.item_unit_price) AS unit_price, 
                SUM(si.item_total_price) AS total_sales
            FROM sales_items si
            JOIN items i ON si.item_id = i.item_id
            JOIN receipts r ON si.sale_id = r.sale_id
            LEFT JOIN receipts r_refund ON r.sale_id = r_refund.sale_id AND r_refund.receipt_type = 'refund'
            WHERE 
                EXTRACT(MONTH FROM r.date_created) = $1 
                AND EXTRACT(YEAR FROM r.date_created) = $2
                AND r_refund.sale_id IS NULL -- Ensure only sales without refunds are included
            GROUP BY day, i.item_name
            ORDER BY day, i.item_name;
            `,
            [month, year]
        );

        res.json({
            summary: summaryResult.rows,
            detailed: detailedResult.rows,
        });
    } catch (error) {
        console.error('Error fetching sales report:', error);
        res.status(500).json({ error: 'Failed to fetch sales report' });
    }
};

// Get expenses report data
const getExpensesReport = async (req, res) => {
    const { month, year } = req.query;

    try {
        // Summary Query: Group by expense_name and sum the expense_amount
        const summaryResult = await pool.query(
            `
            SELECT 
                CASE
                    WHEN e.expense_name = 'Food' THEN 'Food'
                    WHEN e.expense_name = 'Water' THEN 'Water'
                    WHEN e.expense_name LIKE 'Others%' THEN 'Others'
                    ELSE 'Other'
                END AS expense_name,
                SUM(e.expense_amount) AS total_amount
            FROM expenses e
            WHERE EXTRACT(MONTH FROM e.date_created) = $1 
            AND EXTRACT(YEAR FROM e.date_created) = $2
            AND e.status = 'active'
            GROUP BY expense_name
            ORDER BY total_amount DESC;
            `,
            [month, year]
        );

        // Detailed Query: No changes needed here for now
        const detailedResult = await pool.query(
            `
            SELECT 
                EXTRACT(DAY FROM e.date_created) AS day,
                e.expense_name, 
                SUM(e.expense_amount) AS expense_amount
            FROM expenses e
            WHERE EXTRACT(MONTH FROM e.date_created) = $1 
            AND EXTRACT(YEAR FROM e.date_created) = $2
            AND e.status = 'active'
            GROUP BY day, e.expense_name
            ORDER BY day ASC, e.expense_name;
            `,
            [month, year]
        );

        res.json({
            summary: summaryResult.rows,
            detailed: detailedResult.rows,
        });
    } catch (error) {
        console.error('Error fetching expenses report:', error);
        res.status(500).json({ error: 'Failed to fetch expenses report' });
    }
};

// Get labor report data
const getLaborReport = async (req, res) => {
    const { month, year } = req.query;

    try {
        // Summary Query: Aggregate total service costs and days worked per mechanic
        const summaryResult = await pool.query(
            `
            SELECT 
                m.mechanic_name,
                COUNT(DISTINCT EXTRACT(DAY FROM sm.date_created)) AS days_worked,
                SUM(sm.service_price) AS total_service_amount
            FROM sales_mechanics sm
            JOIN mechanics m ON sm.mechanic_id = m.mechanic_id
            WHERE EXTRACT(MONTH FROM sm.date_created) = $1
            AND EXTRACT(YEAR FROM sm.date_created) = $2
            GROUP BY m.mechanic_name
            ORDER BY total_service_amount DESC;
            `,
            [month, year]
        );

        // Detailed Query: Aggregate service costs by day and mechanic
        const detailedResult = await pool.query(
            `
            SELECT 
                EXTRACT(DAY FROM sm.date_created) AS day,
                m.mechanic_name,
                SUM(sm.service_price) AS service_price
            FROM sales_mechanics sm
            JOIN mechanics m ON sm.mechanic_id = m.mechanic_id
            WHERE EXTRACT(MONTH FROM sm.date_created) = $1 
            AND EXTRACT(YEAR FROM sm.date_created) = $2
            GROUP BY day, m.mechanic_name
            ORDER BY day ASC, m.mechanic_name;
            `,
            [month, year]
        );

        res.json({
            summary: summaryResult.rows,
            detailed: detailedResult.rows,
        });
    } catch (error) {
        console.error('Error fetching labor report:', error);
        res.status(500).json({ error: 'Failed to fetch labor report' });
    }
};

module.exports = {
    getSalesReport,
    getExpensesReport,
    getLaborReport
}
