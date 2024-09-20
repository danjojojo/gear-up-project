const pool = require('../config/db');
require('dotenv').config();

const getWaitlistItems = async (req, res) => {
    try {
        const query = `
            SELECT 
                w.waitlist_item_id,       
                i.item_name,
                i.item_price,
                i.bike_parts,
                w.date_created
            FROM 
                waitlist w
            JOIN 
                items i
            ON 
                w.item_id = i.item_id
            ORDER BY 
                w.date_created DESC;
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching waitlist items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getWaitlistItems
};