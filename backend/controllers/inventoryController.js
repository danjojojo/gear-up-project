const pool = require('../config/db');
require('dotenv').config();

// Add item
const addItem = async (req, res) => {
    try {
        const { itemName, itemPrice, stock, category, lowStockAlert, lowStockThreshold, bikeParts } = req.body;
        const itemImage = req.file ? req.file.filename : null; // Get the file name

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

        // Insert item into database
        const query = `
            INSERT INTO items (item_name, item_price, stock_count, category_id, low_stock_alert, low_stock_count, bike_parts, item_image) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
        const values = [itemName, itemPrice, stock, categoryId, lowStockAlert, lowStockThreshold, bikeParts, itemImage];

        const result = await pool.query(query, values);

        res.status(201).json({ item: result.rows[0] });
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { addItem };