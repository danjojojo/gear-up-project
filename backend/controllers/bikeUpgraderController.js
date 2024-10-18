const pool = require('../config/db');

// Get headset items
const getHeadsetItems = async (req, res) => {
    try {
        const query = `
            SELECT 
                h.*,
                i.item_name,
                i.item_price,
                i.stock_count,
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

module.exports = {
    getHeadsetItems,

};