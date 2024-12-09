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
                SUM((si.item_qty - si.refund_qty - si.return_qty)) AS quantity, 
                SUM((si.item_qty - si.refund_qty - si.return_qty) * si.item_unit_price) AS total_sales
            FROM sales_items si
            JOIN sales S on SI.sale_id = s.sale_id
            JOIN items i ON si.item_id = i.item_id
            JOIN receipts r ON si.sale_id = r.sale_id
            LEFT JOIN receipts r_refund ON r.sale_id = r_refund.sale_id AND r_refund.receipt_type = 'refund'
            WHERE 
                EXTRACT(MONTH FROM r.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') = $1 
                AND EXTRACT(YEAR FROM r.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') = $2
                AND s.status = true AND si.sale_item_type = 'sale'
                AND si.item_qty > si.refund_qty AND si.item_qty > si.return_qty
            GROUP BY i.item_name
            ORDER BY total_sales DESC;

            `,
            [month, year]
        );

        // Detailed Query
        const detailedResult = await pool.query(
            `
            SELECT 
                EXTRACT(DAY FROM r.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') AS day,
                i.item_name, 
                SUM((si.item_qty - si.refund_qty - si.return_qty)) AS quantity, 
                SUM((si.item_qty - si.refund_qty - si.return_qty) * si.item_unit_price) AS total_sales,
                AVG(si.item_unit_price) AS unit_price
            FROM sales_items si
            JOIN sales S on SI.sale_id = s.sale_id
            JOIN items i ON si.item_id = i.item_id
            JOIN receipts r ON si.sale_id = r.sale_id
            LEFT JOIN receipts r_refund ON r.sale_id = r_refund.sale_id AND r_refund.receipt_type = 'refund'
            WHERE 
                EXTRACT(MONTH FROM r.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') = $1
                AND EXTRACT(YEAR FROM r.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') = $2
                AND s.status = true AND si.sale_item_type = 'sale'
                AND si.item_qty > si.refund_qty AND si.item_qty > si.return_qty
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
        res.status(500).json({ error: "Error" });
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
            WHERE EXTRACT(MONTH FROM e.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') = $1 
            AND EXTRACT(YEAR FROM e.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') = $2
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
                EXTRACT(DAY FROM e.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') AS day,
                e.expense_name, 
                SUM(e.expense_amount) AS expense_amount
            FROM expenses e
            WHERE EXTRACT(MONTH FROM e.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') = $1 
            AND EXTRACT(YEAR FROM e.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') = $2
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
        res.status(500).json({ error: 'Failed to fetch expenses report' });
    }
};

// Get labor report data
const getLaborReport = async (req, res) => {
    const { month, year } = req.query;

    try {
        const getMechanicPercentage = `
            SELECT 
                setting_value
            FROM settings
            WHERE setting_key = 'mechanic_percentage';
        `;
        const value = await pool.query(getMechanicPercentage);
        const mechanicPercentage = value.rows[0].setting_value;

        // Summary Query: Aggregate total service costs and days worked per mechanic
        const summaryResult = await pool.query(
            `
            SELECT 
                m.mechanic_name,
                COUNT(DISTINCT EXTRACT(DAY FROM sm.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila')) AS days_worked,
                SUM(sm.service_price) AS total_service_amount
            FROM sales_mechanics sm
            JOIN mechanics m ON sm.mechanic_id = m.mechanic_id
            WHERE EXTRACT(MONTH FROM sm.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') = $1
            AND EXTRACT(YEAR FROM sm.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') = $2
            GROUP BY m.mechanic_name
            ORDER BY total_service_amount DESC;
            `,
            [month, year]
        );

        // Detailed Query: Aggregate service costs by day and mechanic
        const detailedResult = await pool.query(
            `
            SELECT 
                EXTRACT(DAY FROM sm.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') AS day,
                m.mechanic_name,
                SUM(sm.service_price) AS service_price
            FROM sales_mechanics sm
            JOIN mechanics m ON sm.mechanic_id = m.mechanic_id
            WHERE EXTRACT(MONTH FROM sm.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') = $1 
            AND EXTRACT(YEAR FROM sm.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') = $2
            GROUP BY day, m.mechanic_name
            ORDER BY day ASC, m.mechanic_name;
            `,
            [month, year]
        );

        res.json({
            summary: summaryResult.rows,
            detailed: detailedResult.rows,
            mechanicPercentage,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch labor report' });
    }
};

const getOrderReport = async (req, res) => {
    const { month, year } = req.query;

    try {
        // Summary Query
        const summaryResult = await pool.query(
            `
            SELECT 
                COUNT(DISTINCT CASE WHEN oi.part_type = 'Bike Builder' AND o.payment_status = 'paid' THEN o.order_id END) AS bike_builder_orders,
                COUNT(DISTINCT CASE WHEN oi.part_type = 'Bike Upgrader' AND o.payment_status = 'paid' THEN o.order_id END) AS bike_upgrader_orders,
                COUNT(DISTINCT CASE WHEN o.payment_status = 'paid' THEN o.order_id END) AS total_orders,
                COUNT(CASE WHEN o.payment_status = 'paid' THEN oi.order_item_id END) AS total_order_items,
                SUM(CASE WHEN o.payment_status = 'paid' THEN (oi.item_qty * oi.item_price) ELSE 0 END) AS total_revenue
            FROM orders o
            LEFT JOIN order_items oi ON o.order_id = oi.order_id
            WHERE 
                EXTRACT(MONTH FROM o.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') = $1 
                AND EXTRACT(YEAR FROM o.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') = $2;
            `,
            [month, year]
        );

        // Detailed Query
        const detailedResult = await pool.query(
            `
            SELECT 
                EXTRACT(DAY FROM o.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') AS day,
                UPPER(SUBSTRING(o.order_name, 1, 5)) || SUBSTRING(o.order_name, 6) AS order_name, 
                o.cust_name,
                o.order_amount AS amount,
                COUNT(oi.order_item_id) AS num_items,
                o.processed_at,
                o.completed_at,
                MAX(CASE WHEN oi.part_type = 'Bike Builder' THEN 'Yes' ELSE 'No' END) AS bike_builder,
                MAX(CASE WHEN oi.part_type = 'Bike Upgrader' THEN 'Yes' ELSE 'No' END) AS bike_upgrader
            FROM orders o
            LEFT JOIN order_items oi ON o.order_id = oi.order_id
            WHERE 
                EXTRACT(MONTH FROM o.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') = $1 
                AND EXTRACT(YEAR FROM o.date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') = $2
                AND o.payment_status = 'paid'
            GROUP BY day, o.order_name, o.cust_name, o.order_amount, o.processed_at, o.completed_at
            ORDER BY day ASC, o.order_name;

            `,
            [month, year]
        );

        res.json({
            summary: summaryResult.rows[0], // Single row for summary
            detailed: detailedResult.rows,  // Multiple rows for detailed data
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch order report' });
    }
};


module.exports = {
    getSalesReport,
    getExpensesReport,
    getLaborReport,
    getOrderReport
}
