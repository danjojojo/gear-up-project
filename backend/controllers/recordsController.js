const pool = require("../config/db");

const getDashboardData = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "No token provided " });
    }
    
    // Extract query parameters
    const { reference, date } = req.query;
    console.log(reference, date);

    switch (reference) {
        case 'sales':
            try {
                const query = `
                    SELECT 
                        SUM
                        (
                            CASE 
                                WHEN DATE(si.date_created) = $1 AND si.refund_qty = 0 THEN si.item_total_price
                                WHEN DATE(si.date_created) = $1 AND si.refund_qty = si.item_qty THEN 0
                                WHEN DATE(si.date_created) = $1 AND si.refund_qty < si.item_qty THEN (si.item_qty - si.refund_qty) * si.item_unit_price 
                            ELSE 0 
                            END
                        ) AS sales_today,
                        SUM(
                            CASE 
                                WHEN DATE(si.date_created) = $1 AND si.refund_qty = 0 THEN item_qty 
                                WHEN DATE(si.date_created) = $1 AND si.refund_qty = si.item_qty THEN 0
                                WHEN DATE(si.date_created) = $1 AND si.refund_qty < si.item_qty THEN (si.item_qty - si.refund_qty)
                            ELSE 0 
                            END
                        ) AS sold_today,
                        SUM
                        (
                            CASE
                                WHEN si.refund_qty = 0 THEN si.item_total_price
                                WHEN si.refund_qty = si.item_qty THEN 0
                            ELSE (si.item_qty - si.refund_qty) * si.item_unit_price
                            END
                        ) AS total_sales,
                        SUM(si.item_qty) AS total_sold
                    FROM sales_items SI
                    JOIN sales S ON SI.sale_id = S.sale_id
                    WHERE s.status = true AND sale_item_type = 'sale';
                    ;
                `;
                const values = [date];
                const { rows } = await pool.query(query, values);
                const dashboardData = rows[0];  // 'rows' is an array, so use 'rows' and access the first element

                res.json({
                    d1: dashboardData.sales_today,
                    d2: dashboardData.sold_today,
                    d3: dashboardData.total_sales,
                    d4: dashboardData.total_sold
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            break;
        case 'labor':
            try {
                const query = `
                    SELECT 
                        COUNT(CASE WHEN DATE(sm.date_created) = $1 THEN sale_service_id ELSE NULL END) AS rendered_today,
                        SUM(CASE WHEN DATE(sm.date_created) = $1 THEN service_price ELSE 0 END) AS earned_today,
                        COUNT(sm.sale_service_id) AS total_rendered,
                        SUM(sm.service_price) AS total_earned
                    FROM sales_mechanics SM
                    JOIN sales S ON SM.sale_id = S.sale_id
                    WHERE s.status = true;
                `;
                const values = [date];
                const { rows } = await pool.query(query, values);
                const dashboardData = rows[0];  // 'rows' is an array, so use 'rows' and access the first element

                res.json({
                    d1: dashboardData.earned_today,
                    d2: dashboardData.rendered_today,
                    d3: dashboardData.total_earned,
                    d4: dashboardData.total_rendered
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            break;
        case 'expenses':
            try {
                const query = `
                    SELECT 
                        SUM(CASE WHEN DATE(date_created) = $1 THEN expense_amount ELSE 0 END) AS expenses_today,
                        COUNT(CASE WHEN DATE(date_created) = $1 THEN expense_id ELSE NULL END) AS entries_today,
                        SUM(expense_amount) AS total_expenses,
                        COUNT(expense_id) AS total_entries
                    FROM expenses;
                `;
                const values = [date];
                const { rows } = await pool.query(query, values);
                const dashboardData = rows[0];  // 'rows' is an array, so use 'rows' and access the first element

                res.json({
                    d1: dashboardData.expenses_today,
                    d2: dashboardData.entries_today,
                    d3: dashboardData.total_expenses,
                    d4: dashboardData.total_entries
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            break;
        default:
            res.status(400).json({ error: "Invalid reference" });
            break;
    }
};

const getRecords = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "No token provided " });
    }
    
    // Extract query parameters
    const { reference, date } = req.query;
    console.log(reference, date);

    switch (reference) {
        case 'sales':
            try {
                const query = `
                    SELECT DISTINCT R.receipt_name AS record_name, 
                    SUM(
                        CASE 
                            WHEN si.refund_qty = 0 THEN si.item_total_price
                            WHEN si.refund_qty = si.item_qty THEN 0
                            ELSE (si.item_qty - si.refund_qty) * si.item_unit_price
                        END
                    ) 
                    AS record_total_amount, P.pos_name, R.date_created, R.sale_id AS record_id
                        FROM receipts R
                        JOIN pos_users P ON R.pos_id = P.pos_id
                        JOIN sales S ON R.sale_id = S.sale_id
                        JOIN sales_items SI ON SI.sale_id = S.sale_id
                        WHERE DATE(R.date_created) = $1 AND S.status = true AND r.receipt_type = 'sale'
                    GROUP BY R.receipt_name, P.pos_name, R.date_created, R.sale_id
                    ORDER BY R.date_created DESC
                `;
                const values = [date];
                const { rows } = await pool.query(query, values);

                res.json({
                    records: rows
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            break;
        case 'labor':
            try {
                const query = `
                    SELECT DISTINCT R.receipt_name AS record_name, SUM(SM.service_price) AS record_total_amount, P.pos_name, R.date_created, R.sale_id AS record_id
                        FROM receipts R
                        JOIN pos_users P ON R.pos_id = P.pos_id
                        JOIN sales S ON R.sale_id = S.sale_id
                        JOIN sales_mechanics SM ON SM.sale_id = S.sale_id
                        WHERE DATE(R.date_created) = $1 AND S.status = true
                    GROUP BY R.receipt_name, P.pos_name, R.date_created, R.sale_id
                    ORDER BY R.date_created DESC
                `;
                const values = [date];
                const { rows } = await pool.query(query, values);

                res.json({
                    records: rows
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            break;
        case 'expenses':
            try {
                const query = `
                    SELECT e.expense_name AS record_name, e.expense_amount AS record_total_amount, p.pos_name, e.date_created, e.expense_id AS record_id
                        FROM expenses E
                        JOIN pos_users P ON E.pos_id = P.pos_id
                    WHERE DATE(e.date_created) = $1
                    ORDER BY e.date_created DESC
                `;
                const values = [date];
                const { rows } = await pool.query(query, values);

                res.json({
                    records: rows
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            break;
        default:
            res.status(400).json({ error: "Invalid reference" });
            break;
    }
}

const getHighlightDates = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "No token provided " });
    }
    
    // Extract query parameters
    const { reference } = req.query;
    console.log(reference);

    switch (reference) {
        case 'sales':
            try {
                const query = `
                    SELECT DATE(R.date_created) AS date_created 
                        FROM receipts R
                        JOIN sales S ON R.sale_id = S.sale_id
                        JOIN sales_items SI ON SI.sale_id = S.sale_id
                        WHERE S.status = true
                    GROUP BY DATE(R.date_created)
                `;
                const { rows } = await pool.query(query);

                res.json({
                    dates: rows
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            break;
        case 'labor':
            try {
                const query = `
                    SELECT DATE(R.date_created) AS date_created 
                        FROM receipts R
                        JOIN sales S ON R.sale_id = S.sale_id
                        JOIN sales_mechanics SM ON SM.sale_id = S.sale_id
                        WHERE S.status = true
                    GROUP BY DATE(R.date_created)
                `;
                const { rows } = await pool.query(query);

                res.json({
                    dates: rows
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            break;
        case 'expenses':
            try {
                const query = `
                    SELECT DATE(date_created) AS date_created 
                        FROM expenses
                    GROUP BY DATE(date_created)
                `;
                const { rows } = await pool.query(query);

                res.json({
                    dates: rows
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            break;
    
        default:
            res.status(400).json({ error: "Invalid reference"});
            break;
    }
}

const getInnerRecords = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "No token provided " });
    }
    
    // Extract query parameters
    const { reference, id } = req.query;
    console.log(reference);

    switch (reference) {
        case 'sales':
            try {
                const query = `
                   SELECT I.item_name, SI.item_qty, SI.item_unit_price, SI.item_total_price, SI.refund_qty
                    FROM sales_items SI 
                    JOIN items I ON SI.item_id = I.item_id 
                   WHERE SI.sale_id = $1
                `;
                const values = [id];
                const { rows } = await pool.query(query, values);

                res.json({
                    inner: rows
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            break;
        case 'labor':
            try {
                const query = `
                    SELECT M.mechanic_name, SM.service_price 
                        FROM sales_mechanics SM 
                        JOIN mechanics M ON SM.mechanic_id = M.mechanic_id 
                    WHERE SM.sale_id = $1 
                `;
                const values = [id];
                const { rows } = await pool.query(query, values);

                res.json({
                    inner: rows
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            break;
        case 'expenses':
            try {
                const query = `
                    SELECT encode(expense_image, 'base64') AS expense_image, expense_name, expense_amount
                        FROM expenses
                    WHERE expense_id = $1
                `;
                const values = [id];
                const { rows } = await pool.query(query, values);
                res.json({
                    inner: rows[0]
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            break;
    
        default:
            res.status(400).json({ error: "Invalid reference" });
            break;
    }
}
const getLeaderBoards = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "No token provided " });
    }

    const { reference, start, end } = req.query;

    switch (reference) {
        case 'sales':
            try {
                const query = `
                    SELECT item_name, 
                    SUM(
                        CASE 
                            WHEN refund_qty = 0 THEN item_qty
                            WHEN refund_qty = item_qty THEN 0
                        ELSE (item_qty - refund_qty)
                        END
                    ) AS item_qty
                        FROM sales_items SI
                        JOIN items I ON SI.item_id = I.item_id
                        JOIN sales S ON SI.sale_id = S.sale_id
                        WHERE si.date_created::date BETWEEN $1 AND $2 AND S.status = true AND Si.sale_item_type = 'sale'
                        GROUP BY item_name
                        HAVING SUM(
                            CASE 
                                WHEN refund_qty = 0 THEN item_qty
                                WHEN refund_qty = item_qty THEN 0
                                ELSE (item_qty - refund_qty)
                            END
                        ) > 0
                        ORDER BY item_qty DESC
                    LIMIT 10;
                `;
                const values = [start, end];

                const { rows } = await pool.query(query, values);
                res.json({ leaderBoards: rows });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            break;
        case 'labor':
            try {
                const query = `
                    SELECT mechanic_name as item_name, SUM(service_price) as item_qty
                        FROM sales_mechanics SM
                        JOIN mechanics me ON SM.mechanic_id = me.mechanic_id
                        JOIN sales S ON SM.sale_id = S.sale_id
                        WHERE sm.date_created::date BETWEEN $1 AND $2 AND S.status = true
                        GROUP BY mechanic_name
                        ORDER BY SUM(service_price) DESC
                    LIMIT 10;
                `;
                const values = [start, end];

                const { rows } = await pool.query(query, values);
                res.json({ leaderBoards: rows });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            break;
        case 'expenses':
            try {
                const query = `
                    SELECT expense_name as item_name, SUM(expense_amount) as item_qty
                        FROM expenses e
                    GROUP BY expense_name
                    ORDER BY SUM(expense_amount) DESC
                `;
                
                const { rows } = await pool.query(query);
                res.json({ leaderBoards: rows });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            break;
        default:
            res.status(400).json({ error: "Invalid reference" });
            break;
    }
}


module.exports = {
    getDashboardData,
    getRecords,
    getHighlightDates,
    getInnerRecords,
    getLeaderBoards
}