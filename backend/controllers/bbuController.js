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

// Update frame item
const updateFrameItem = async (req, res) => {
    try {
        const { id } = req.params; // Get the item_id from the URL
        const {
            description,
            frame_size,
            head_tube_type,
            head_tube_upper_diameter,
            head_tube_lower_diameter,
            seatpost_diameter,
            axle_type,
            axle_width,
            bottom_bracket_type,
            bottom_bracket_diameter,
            rotor_size,
            max_tire_width,
            brake_mount,
            cable_routing,
            material,
            weight,
        } = req.body;

        // Handle the image file if it exists
        const item_image = req.file ? req.file.buffer : null;

        // Prepare the SQL query and parameters
        const query = `
            UPDATE frame
            SET 
                description = $1,
                frame_size = $2,
                head_tube_type = $3,
                head_tube_upper_diameter = $4,
                head_tube_lower_diameter = $5,
                seatpost_diameter = $6,
                axle_type = $7,
                axle_width = $8,
                bottom_bracket_type = $9,
                bottom_bracket_diameter = $10,
                rotor_size = $11,
                max_tire_width = $12,
                brake_mount = $13,
                cable_routing = $14,
                material = $15,
                weight = $16,
                image = $17,
                date_updated = $18
            WHERE item_id = $19
            RETURNING *;
        `;

        // Execute the query
        const values = [
            description, frame_size, head_tube_type, head_tube_upper_diameter,
            head_tube_lower_diameter, seatpost_diameter, axle_type, axle_width,
            bottom_bracket_type, bottom_bracket_diameter, rotor_size, max_tire_width,
            brake_mount, cable_routing, material, weight, item_image, new Date(), id
        ];

        const updatedItem = await pool.query(query, values);  

        // Send the updated item in the response
        res.status(200).json({ message: 'Item updated successfully', item: updatedItem.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the item', error });
    }
};


module.exports = {
    getPartsCount,
    getFrameItems,
    getForkItems,
    getGroupsetItems,
    getWheelsetItems,
    getCockpitItems,
    updateFrameItem
};