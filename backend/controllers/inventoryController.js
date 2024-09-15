const pool = require('../config/db');
require('dotenv').config();

// Add item
const addItem = async (req, res) => {
    try {
        const { itemName, itemPrice, stock, category, lowStockAlert, lowStockThreshold, bikeParts } = req.body;
        const itemImage = req.file ? req.file.buffer : null; // Get the file data

        // Log received item data
        console.log('Received item data:', {
            itemName,
            itemPrice,
            stock,
            category,
            lowStockAlert,
            lowStockThreshold,
            bikeParts,
            itemImage
        });

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

        // Insert item into database
        const query = `
            INSERT INTO items (item_name, item_price, stock_count, category_id, low_stock_alert, low_stock_count, bike_parts, item_image) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
        const values = [itemName, itemPrice, stock, categoryId, itemLowStockAlert, itemLowStockThreshold, bikeParts, itemImage];

        // Log the query and values
        console.log('Executing query:', query);
        console.log('With values:', values);

        const result = await pool.query(query, values);

        res.status(201).json({ item: result.rows[0] });
    } catch (error) {
        // Log the error with detailed information
        console.error('Error adding item:', error.message);
        console.error('Error details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Display item
const displayItem = async (req, res) => {
    try {
        const query = `
            SELECT 
                i.item_id,
                i.item_name, 
                i.item_price, 
                i.stock_count, 
                i.low_stock_alert, 
                i.low_stock_count,
                c.category_name 
            FROM items i 
            JOIN category c ON i.category_id = c.category_id;
        `;
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { addItem, displayItem };