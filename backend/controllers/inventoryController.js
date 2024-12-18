const pool = require('../config/db');
const { v4: uuidv4 } = require("uuid");
require('dotenv').config();


// Display dashboard data
const getDashboardData = async (req, res) => {
    try {
        // Query to get the total number of items available
        const totalItemsQuery = 'SELECT COUNT(*) FROM items WHERE status = true and is_deleted = false';
        const totalItemsResult = await pool.query(totalItemsQuery);
        const totalItems = parseInt(totalItemsResult.rows[0].count, 10) || 0;

        // Query to get the total number of low stock items
        const lowStockItemsQuery = `
            SELECT 
                COUNT(*)
            FROM items
            LEFT JOIN rop_summary_view rop ON rop.item_id = items.item_id
            WHERE
                stock_count > 0 
                AND
                (
                    (lead_time_demand + safety_stock = 0 AND stock_count <= 5) -- Fallback case
                    OR
                    (lead_time_demand + safety_stock > 0 AND stock_count <= lead_time_demand + safety_stock) -- Normal case
                )
                AND status = true
                AND is_deleted = false`;

        const lowStockItemsResult = await pool.query(lowStockItemsQuery);
        const lowStockItems = parseInt(lowStockItemsResult.rows[0].count, 10) || 0;

        // Query to get the total stock count
        const stockCountsQuery = 'SELECT SUM(stock_count) FROM items WHERE status = true and is_deleted = false';
        const stockCountsResult = await pool.query(stockCountsQuery);
        const stockCounts = parseInt(stockCountsResult.rows[0].sum, 10) || 0;

        // Query to get the total stock value
        const stockValueQuery = 'SELECT SUM(item_price * stock_count) FROM items WHERE status = true and is_deleted = false';
        const stockValueResult = await pool.query(stockValueQuery);
        const stockValue = Number(stockValueResult.rows[0].sum) || 0;

        res.status(200).json({
            totalItems,
            lowStockItems,
            stockCounts,
            stockValue: stockValue
        });
    } catch (error) {
        res.status(500).json({ error:  "Error" });
    }
};


// Add item
const addItem = async (req, res) => {
    try {
        const { itemName, itemPrice, itemCost, stock, category, lowStockAlert, lowStockThreshold, addToBikeBuilder, bikeParts } = req.body;
        const itemID = "item-" + uuidv4();
        const itemImage = req.file ? req.file.buffer : null;

        // Validate required fields
        if (!itemName || !itemPrice || !stock || !category) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Fetch category_id from category name
        const categoryQuery = 'SELECT category_id FROM category WHERE category_name = $1';
        const categoryResult = await pool.query(categoryQuery, [category]);

        if (categoryResult.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid category' });
        }

        const categoryId = categoryResult.rows[0].category_id;

        // Handle low_stock_alert and low_stock_threshold
        const itemLowStockAlert = lowStockAlert === 'true';
        const itemLowStockThreshold = itemLowStockAlert ? (lowStockThreshold ? parseInt(lowStockThreshold, 10) : null) : null;

        // Handle add_to_bike_builder and bike_parts
        const itemAddToBikeBuilder = addToBikeBuilder === 'true';
        const itemBikeParts = itemAddToBikeBuilder ? bikeParts : null;

        const bikeBuilderUpgraderStatus = false;

        // Insert item into database
        const query = `
            INSERT INTO items (
                item_id, 
                item_name,
                item_price,
                item_cost,
                stock_count,
                category_id,
                low_stock_alert,
                low_stock_count,
                add_part,
                bike_parts,
                item_image
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *`;

        const values = [
            itemID,
            itemName,
            parseFloat(itemPrice),
            itemCost,
            parseInt(stock, 10),
            categoryId,
            itemLowStockAlert,
            itemLowStockThreshold,
            itemAddToBikeBuilder,
            itemBikeParts,
            itemImage
        ];

        const result = await pool.query(query, values);

        const newItem = result.rows[0];
        const waitlistID = "waitlist-" + uuidv4();

        if (itemAddToBikeBuilder) {
            const waitlistQuery = `
                INSERT INTO waitlist (waitlist_item_id, item_id)
                VALUES ($1, $2)
                RETURNING *`;

            const waitlistValues = [
                waitlistID,
                newItem.item_id
            ];

            try {
                await pool.query(waitlistQuery, waitlistValues);
            } catch (error) {
                console.error('Error inserting into waitlist');
            }
        }

        // Fetch updated list of items
        const itemsQuery = 'SELECT * FROM items';
        const itemsResult = await pool.query(itemsQuery);

        res.status(201).json({ items: itemsResult.rows, newItem: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: "Error" });
    }
};

// Archive item
const archiveItem = async (req, res) => {
    const { item_id } = req.params;

    try {
        const query = `
            UPDATE items
            SET status = false, date_updated = NOW()
            WHERE item_id = $1
            RETURNING *; 
        `;
        const result = await pool.query(query, [item_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({
            message: 'Item archived successfully',
            item: result.rows[0],
        });
    } catch (error) {
        console.error('Error archiving item');
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Restore item
const restoreItem = async (req, res) => {
    const { item_id } = req.params;

    try {
        const query = `
            UPDATE items
            SET status = true, date_updated = NOW()
            WHERE item_id = $1
            RETURNING *; 
        `;
        const result = await pool.query(query, [item_id]);

        // Check if the item was found and updated
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Send a success response with the updated item
        res.status(200).json({
            message: 'Item restored successfully',
            item: result.rows[0], // Return the restored item details
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete item
const deleteItem = async (req, res) => {
    const { item_id } = req.params;

    try {
        const deleteQuery = `
            UPDATE items
            SET is_deleted = true, date_updated = NOW()
            WHERE item_id = $1 RETURNING *;
        `;
        const result = await pool.query(deleteQuery, [item_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ message: 'Item deleted successfully', item: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Display item
const displayItem = async (req, res) => {
    const { archived } = req.query; // Get archived parameter from query

    try {
        const query = `
            SELECT 
                i.item_id,
                i.item_name, 
                i.item_price, 
                i.stock_count, 
                i.low_stock_alert, 
                i.low_stock_count,
                i.date_created,
                i.add_part,
                i.bb_bu_status,
                c.category_name,
                CASE
                    WHEN
                        lead_time_demand + safety_stock = 0 THEN 5
                    ELSE 
                        lead_time_demand + safety_stock
                END AS threshold
            FROM 
                items i 
            JOIN 
                category c ON i.category_id = c.category_id
            LEFT JOIN
                rop_summary_view rop ON rop.item_id = i.item_id
            WHERE 
                i.status = $1 and i.is_deleted = false;
        `;

        const { rows } = await pool.query(query, [archived === 'true']);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT 
                i.item_id,
                i.item_name,
                i.item_cost, 
                i.item_price, 
                i.stock_count, 
                i.low_stock_alert, 
                i.low_stock_count,
                c.category_name,
                i.add_part,
                i.bike_parts,
                i.bb_bu_status,
                encode(i.item_image, 'base64') AS item_image,
                i.date_created,
                CASE
                    WHEN
                        lead_time_demand + safety_stock = 0 THEN 5
                    ELSE 
                        lead_time_demand + safety_stock
                END AS threshold,
                COALESCE(lts.avg_lead_time_days, 0) AS avg_lead_time_days,
		        COALESCE(lts.max_lead_time_days, 0) AS max_lead_time_days,
                COALESCE(sq.avg_sold_qty, 0) AS avg_sold_qty,
		        COALESCE(sq.max_sold_qty, 0) AS max_sold_qty,
                COALESCE(ps.max_sold_qty, 0) AS pos_max_sold_qty,
                COALESCE(os.max_sold_qty, 0) AS order_max_sold_qty,
                COALESCE(ps.recent_sold_qty, 0) AS pos_sold_qty,
                COALESCE(os.recent_sold_qty, 0) AS order_sold_qty,
                COALESCE(ROUND(lts.recent_lead_time_days), 0) AS lead_time_days
            FROM items i
            JOIN 
                category c ON i.category_id = c.category_id
            LEFT JOIN
                rop_summary_view rop ON rop.item_id = i.item_id
            LEFT JOIN
		        lead_time_summary_view lts ON i.item_id = lts.item_id
            LEFT JOIN
                pos_sales_view ps ON i.item_id = ps.item_id
            LEFT JOIN
                order_sales_view os ON i.item_id = os.item_id
            LEFT JOIN
		        sold_qty_view sq ON i.item_id = sq.item_id
            LEFT JOIN
		        lead_times_view lt ON i.item_id = lt.item_id
            WHERE i.item_id = $1
            GROUP BY 
                i.item_id, 
                c.category_name, 
                lead_time_demand, 
                safety_stock,
                avg_lead_time_days,
                max_lead_time_days,
                sq.avg_sold_qty,
                sq.max_sold_qty,
                pos_max_sold_qty,
                order_max_sold_qty,
                pos_sold_qty,
                order_sold_qty,
                lts.recent_lead_time_days
                ;
        `;
        const { rows } = await pool.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update item
const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { itemName, itemPrice, stock, category, lowStockAlert, lowStockThreshold, addToBikeBuilder, bbBuStatus, bikeParts, itemCost } = req.body;
        const itemImage = req.file ? req.file.buffer : null;
 
        const categoryQuery = 'SELECT category_id FROM category WHERE category_name = $1';
        const categoryResult = await pool.query(categoryQuery, [category]);

        if (categoryResult.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid category' });
        }

        const categoryId = categoryResult.rows[0].category_id;

        const itemLowStockAlert = lowStockAlert === 'true';
        const itemLowStockThreshold = itemLowStockAlert ? (lowStockThreshold ? parseInt(lowStockThreshold, 10) : null) : null;

        const itemAddToBikeBuilder = addToBikeBuilder === 'true';
        const itemBikeParts = itemAddToBikeBuilder || bbBuStatus ? bikeParts : null;
        
        const query = `
            UPDATE items SET
                item_name = $1,
                item_price = $2,
                stock_count = $3,
                category_id = $4,
                low_stock_alert = $5,
                low_stock_count = $6,
                add_part = $7,
                bike_parts = $8,
                item_image = $9,
                date_updated = $10,
                item_cost = $11
            WHERE item_id = $12
            RETURNING *`;

        const values = [
            itemName,
            parseFloat(itemPrice),
            parseInt(stock, 10),
            categoryId,
            itemLowStockAlert,
            itemLowStockThreshold,
            itemAddToBikeBuilder,
            itemBikeParts,
            itemImage,
            new Date(Date.now()).toLocaleString("en-US", { timeZone: "Asia/Manila" }), // date_updated
            itemCost,
            id
        ];

        const result = await pool.query(query, values);

        const updatedItem = result.rows[0];

        // Handle waitlist for updated item
        const currentWaitlistQuery = 'SELECT * FROM waitlist WHERE item_id = $1';
        const currentWaitlistResult = await pool.query(currentWaitlistQuery, [id]);

        const isCurrentlyInWaitlist = currentWaitlistResult.rows.length > 0;
        const waitlistID = "waitlist-" + uuidv4();

        if (itemAddToBikeBuilder && !isCurrentlyInWaitlist) {
            // Add to waitlist if not already present
            const waitlistQuery = `
               INSERT INTO waitlist (waitlist_item_id, item_id)
                VALUES ($1, $2)
                RETURNING *`;

            const waitlistValues = [
                waitlistID,
                updatedItem.item_id
            ];

            await pool.query(waitlistQuery, waitlistValues);
        } else if (!itemAddToBikeBuilder && isCurrentlyInWaitlist) {
            // Remove from waitlist if toggled off
            const deleteWaitlistQuery = 'DELETE FROM waitlist WHERE item_id = $1';
            await pool.query(deleteWaitlistQuery, [id]);
        }

        const itemsQuery = 'SELECT * FROM items';
        const itemsResult = await pool.query(itemsQuery);

        res.status(200).json({ items: itemsResult.rows, updatedItem: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: "Error" });
    }
};

const restockItem = async (req, res) => {
    try {
        const { item_id } = req.params;
        const { stockAdded, stockBefore } = req.body;
        const query = `
            INSERT INTO restock_logs
                (item_id, stock_added, stock_before)
            VALUES 
                ($1, $2, $3)
        `
        const values = [item_id, stockAdded, stockBefore];
        await pool.query(query, values);
        res.status(200).json({ message: 'Stock updated successfully' });
    } catch (error) {
        res.status(500).json({ error: "Error" });
    }
}


module.exports = {
    addItem,
    displayItem,
    getDashboardData,
    getItemById,
    updateItem,
    archiveItem,
    restoreItem,
    deleteItem,
    restockItem
};