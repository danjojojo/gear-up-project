const pool = require('../config/db');

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
                f.item_id = i.item_id
            WHERE 
                i.status = true 
                AND f.status = true;
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
                f.item_id = i.item_id
            WHERE 
                i.status = true 
                AND f.status = true;
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
                    g.item_id = i.item_id
                WHERE 
                    i.status = true 
                    AND g.status = true;
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
                    w.item_id = i.item_id
                WHERE 
                    i.status = true 
                    AND w.status = true;
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
                    c.item_id = i.item_id
                WHERE 
                    i.status = true 
                    AND c.status = true;
        `;

        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching cockpit items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get headset items
const getHeadsetItems = async (req, res) => {
    try {
        const query = `
            SELECT 
                h.*,
                i.item_name,
                i.item_price,
                encode(h.image, 'base64') AS item_image
                FROM 
                    headset h
                JOIN 
                    items i
                ON 
                    h.item_id = i.item_id
                WHERE 
                    i.status = true 
                    AND h.status = true;
        `;

        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching headset items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get handlebar items
const getHandlebarItems = async (req, res) => {
    try {
        const query = `
            SELECT 
                h.*,
                i.item_name,
                i.item_price,
                encode(h.image, 'base64') AS item_image
                FROM 
                    handlebar h
                JOIN 
                    items i
                ON 
                    h.item_id = i.item_id
                WHERE 
                    i.status = true 
                    AND h.status = true;
        `;

        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching handlebar items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get stem items
const getStemItems = async (req, res) => {
    try {
        const query = `
            SELECT 
                s.*,
                i.item_name,
                i.item_price,
                encode(s.image, 'base64') AS item_image
                FROM 
                    stem s
                JOIN 
                    items i
                ON 
                    s.item_id = i.item_id
                WHERE 
                    i.status = true 
                    AND s.status = true;
        `;

        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching stem items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get hubs items
const getHubsItems = async (req, res) => {
    try {
        const query = `
            SELECT 
                h.*,
                i.item_name,
                i.item_price,
                encode(h.image, 'base64') AS item_image
                FROM 
                    hubs h
                JOIN 
                    items i
                ON 
                    h.item_id = i.item_id
                WHERE 
                    i.status = true 
                    AND h.status = true;
        `;

        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching hubs items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getFrameItems,
    getForkItems,
    getGroupsetItems,
    getWheelsetItems,
    getCockpitItems,
    getHeadsetItems,
    getHandlebarItems,
    getStemItems,
    getHubsItems
};
