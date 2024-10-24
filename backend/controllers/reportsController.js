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
            WHERE EXTRACT(MONTH FROM si.date_created) = $1 
            AND EXTRACT(YEAR FROM si.date_created) = $2
            GROUP BY i.item_name
            ORDER BY total_sales DESC;
            `,
            [month, year]
        );

        // Detailed Query
        const detailedResult = await pool.query(
            `
            SELECT 
                EXTRACT(DAY FROM si.date_created) AS day,
                i.item_name, 
                SUM(si.item_qty) AS quantity, 
                AVG(si.item_unit_price) AS unit_price, 
                SUM(si.item_total_price) AS total_sales
            FROM sales_items si
            JOIN items i ON si.item_id = i.item_id
            WHERE EXTRACT(MONTH FROM si.date_created) = $1 
            AND EXTRACT(YEAR FROM si.date_created) = $2
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
                e.expense_name, 
                SUM(e.expense_amount) AS total_amount
            FROM expenses e
            WHERE EXTRACT(MONTH FROM e.date_created) = $1 
            AND EXTRACT(YEAR FROM e.date_created) = $2
            GROUP BY e.expense_name
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

module.exports = {
    getSalesReport,
    getExpensesReport
}
