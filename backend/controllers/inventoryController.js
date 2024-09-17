const pool = require('../config/db');
require('dotenv').config();


// Display dashboard data
const getDashboardData = async (req, res) => {
    try {
        // Query to get the total number of items available
        const totalItemsQuery = 'SELECT COUNT(*) FROM items';
        const totalItemsResult = await pool.query(totalItemsQuery);
        const totalItems = parseInt(totalItemsResult.rows[0].count, 10);

        // Query to get the total number of low stock items
        const lowStockItemsQuery = `
            SELECT COUNT(*) FROM items
            WHERE low_stock_alert = true AND stock_count <= low_stock_count`;
        const lowStockItemsResult = await pool.query(lowStockItemsQuery);
        const lowStockItems = parseInt(lowStockItemsResult.rows[0].count, 10);

        // Query to get the total stock count
        const stockCountsQuery = 'SELECT SUM(stock_count) FROM items';
        const stockCountsResult = await pool.query(stockCountsQuery);
        const stockCounts = parseInt(stockCountsResult.rows[0].sum, 10);

        // Query to get the total stock value
        const stockValueQuery = 'SELECT SUM(item_price * stock_count) FROM items';
        const stockValueResult = await pool.query(stockValueQuery);
        const stockValue = parseFloat(stockValueResult.rows[0].sum).toFixed(2);

        res.status(200).json({
            totalItems,
            lowStockItems,
            stockCounts,
            stockValue: `₱ ${stockValue}`
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



// Add item
const addItem = async (req, res) => {
    try {
        const { itemName, itemPrice, stock, category, lowStockAlert, lowStockThreshold, addToBikeBuilder, bikeParts } = req.body;
        const itemImage = req.file ? req.file.buffer : null; // Get the file data

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

        // Insert item into database
        const query = `
            INSERT INTO items (
                item_name,
                item_price,
                stock_count,
                category_id,
                low_stock_alert,
                low_stock_count,
                add_part,
                bike_parts,
                item_image
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
            itemImage
        ];

        const result = await pool.query(query, values);

        // Fetch updated list of items
        const itemsQuery = 'SELECT * FROM items';
        const itemsResult = await pool.query(itemsQuery);

        res.status(201).json({ items: itemsResult.rows, newItem: result.rows[0] });
    } catch (error) {
        console.error('Error adding item:', error.message);
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

const getItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT 
                i.item_id,
                i.item_name, 
                i.item_price, 
                i.stock_count, 
                i.low_stock_alert, 
                i.low_stock_count,
                c.category_name,
                i.add_part,
                i.bike_parts,
                encode(i.item_image, 'base64') AS item_image
            FROM items i
            JOIN category c ON i.category_id = c.category_id
            WHERE i.item_id = $1;
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



module.exports = {
    addItem,
    displayItem,
    getDashboardData,
    getItemById
};