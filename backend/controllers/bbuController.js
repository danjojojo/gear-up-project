const pool = require('../config/db');

// Get parts item count
const getPartsCount = async (req, res) => {
    const { partType } = req.params;

    const validPartTypes = [
        'frame', 'fork', 'groupset', 'wheelset',
        'cockpit', 'headset', 'handlebar', 'stem', 'hubs'
    ];

    if (!validPartTypes.includes(partType)) {
        return res.status(400).json({ error: 'Invalid part type' });
    }

    try {
        const query = `SELECT COUNT(*) AS count FROM ${partType}`;
        const result = await pool.query(query);
        res.json({ count: result.rows[0].count });
    } catch (error) {
        console.error(`Error fetching count for ${partType}:`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get frame items
const getFrameItems = async (req, res) => {
    try {
        const query = `
            SELECT 
                f.*,
                i.item_name,
                i.item_price,
                encode(f.image, 'base64') AS item_image
                FROM 
                    frame f
                JOIN 
                    items i
                ON 
                    f.item_id = i.item_id;
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching frame items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get fork items
const getForkItems = async (req, res) => {
    try {
        const query = `
            SELECT 
                f.*,
                i.item_name,
                i.item_price,
                encode(f.image, 'base64') AS item_image
                FROM 
                    fork f
                JOIN 
                    items i
                ON 
                    f.item_id = i.item_id;
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching fork items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get groupset items
const getGroupsetItems = async (req, res) => {
    try {
        const query = `
            SELECT 
                g.*,
                i.item_name,
                i.item_price,
                encode(g.image, 'base64') AS item_image
                FROM 
                    groupset g
                JOIN 
                    items i
                ON 
                    g.item_id = i.item_id;
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching groupset items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get wheelset items
const getWheelsetItems = async (req, res) => {
    try {
        const query = `
            SELECT 
                w.*,
                i.item_name,
                i.item_price,
                encode(w.image, 'base64') AS item_image
                FROM 
                    wheelset w
                JOIN 
                    items i
                ON 
                    w.item_id = i.item_id;
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching wheelset items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get cockpit items
const getCockpitItems = async (req, res) => {
    try {
        const query = `
            SELECT 
                c.*,
                i.item_name,
                i.item_price,
                encode(c.image, 'base64') AS item_image
                FROM 
                    cockpit c
                JOIN 
                    items i
                ON 
                    c.item_id = i.item_id;
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching cockpit items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getPartsCount,
    getFrameItems,
    getForkItems,
    getGroupsetItems,
    getWheelsetItems,
    getCockpitItems
};