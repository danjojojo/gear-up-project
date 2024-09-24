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
        const { id } = req.params;
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

        const item_image = req.file ? req.file.buffer : null;

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
            WHERE frame_id = $19
            RETURNING *;
        `;

        const values = [
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
            item_image,
            new Date(),
            id,
        ];

        const updatedItem = await pool.query(query, values);

        res.status(200).json({ message: 'Item updated successfully', item: updatedItem.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the item', error });
    }
};

// Update fork item
const updateForkItem = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            description,
            fork_size,
            fork_tube_type,
            fork_tube_upper_diameter,
            fork_tube_lower_diameter,
            axle_type,
            axle_width,
            suspension_type,
            rotor_size,
            max_tire_width,
            brake_mount,
            material,
            weight,
        } = req.body;

        const item_image = req.file ? req.file.buffer : null;

        const query = `
            UPDATE fork
            SET 
                description = $1,
                fork_size = $2,
                fork_tube_type = $3,
                fork_tube_upper_diameter = $4,
                fork_tube_lower_diameter = $5,
                axle_type = $6,
                axle_width = $7,
                suspension_type = $8,
                rotor_size = $9,
                max_tire_width= $10 ,
                brake_mount = $11,
                material = $12,
                weight = $13,
                image = $14,
                date_updated = $15
            WHERE fork_id = $16
            RETURNING *;
        `;

        const values = [
            description,
            fork_size,
            fork_tube_type,
            fork_tube_upper_diameter,
            fork_tube_lower_diameter,
            axle_type,
            axle_width,
            suspension_type,
            rotor_size,
            max_tire_width,
            brake_mount,
            material,
            weight,
            item_image,
            new Date(),
            id
        ];

        const updatedItem = await pool.query(query, values);

        res.status(200).json({ message: 'Item updated successfully', item: updatedItem.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the item', error });
    }
};

// Update groupset item
const updateGroupsetItem = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            description,
            chainring_speed,
            crank_arm_length,
            front_derailleur_speed,
            rear_derailleur_speed,
            cassette_type,
            cassette_speed,
            chain_speed,
            bottom_bracket_type,
            bottom_bracket_diameter,
            brake_type,
            axle_type,
            weight,
        } = req.body;

        const item_image = req.file ? req.file.buffer : null;

        const query = `
            UPDATE groupset
            SET 
                description = $1,
                chainring_speed = $2,
                crank_arm_length = $3,
                front_derailleur_speed = $4,
                rear_derailleur_speed = $5,
                cassette_type = $6,
                cassette_speed = $7,
                chain_speed = $8,
                bottom_bracket_type = $9,
                bottom_bracket_diameter = $10,
                brake_type = $11  ,
                axle_type = $12,
                weight = $13,
                image = $14,
                date_updated = $15
            WHERE groupset_id = $16
            RETURNING *;
        `;

        const values = [
            description,
            chainring_speed,
            crank_arm_length,
            front_derailleur_speed,
            rear_derailleur_speed,
            cassette_type,
            cassette_speed,
            chain_speed,
            bottom_bracket_type,
            bottom_bracket_diameter,
            brake_type,
            axle_type,
            weight,
            item_image,
            new Date(),
            id
        ];

        const updatedItem = await pool.query(query, values);

        res.status(200).json({ message: 'Item updated successfully', item: updatedItem.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the item', error });
    }
};

// Update wheelset item
const updateWheelsetItem = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            description,
            tire_size,
            tire_width,
            rim_holes,
            rim_width,
            hub_type,
            hub_speed,
            hub_holes,
            spokes,
            axle_type,
            rotor_type,
            rotor_size,
            weight,
        } = req.body;

        const item_image = req.file ? req.file.buffer : null;

        const query = `
            UPDATE wheelset
            SET 
                description = $1,
                tire_size = $2,
                tire_width = $3,
                rim_holes = $4,
                rim_width = $5,
                hub_type = $6,
                hub_speed = $7,
                hub_holes = $8,
                spokes = $9,
                axle_type = $10,
                rotor_type = $11,
                rotor_size = $12,
                weight = $13,
                image = $14,
                date_updated = $15
            WHERE wheelset_id = $16
            RETURNING *;
        `;

        const values = [
            description,
            tire_size,
            tire_width,
            rim_holes,
            rim_width,
            hub_type,
            hub_speed,
            hub_holes,
            spokes,
            axle_type,
            rotor_type,
            rotor_size,
            weight,
            item_image,
            new Date(),
            id
        ];

        const updatedItem = await pool.query(query, values);

        res.status(200).json({ message: 'Item updated successfully', item: updatedItem.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the item', error });
    }
};

// Update cockpit item
const updateCockpitItem = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            description,
            seatpost_diameter,
            seatpost_length,
            seat_clamp_type,
            handlebar_length,
            handlebar_clamp_diameter,
            handlebar_type,
            stem_clamp_diameter,
            stem_length,
            stem_angle,
            fork_upper_diameter,
            headset_type,
            headset_upper_diameter,
            headset_lower_diameter,
            headset_cup_type,
            stem_material,
            handlebar_material,
            weight,
        } = req.body;

        const item_image = req.file ? req.file.buffer : null;

        const query = `
            UPDATE cockpit
            SET 
                description = $1,
                seatpost_diameter = $2,
                seatpost_length = $3,
                seat_clamp_type = $4,
                handlebar_length = $5,
                handlebar_clamp_diameter = $6,
                handlebar_type = $7,
                stem_clamp_diameter = $8,
                stem_length = $9,
                stem_angle = $10,
                fork_upper_diameter = $11,
                headset_type = $12,
                headset_upper_diameter = $13,
                headset_lower_diameter = $14,
                headset_cup_type = $15,
                stem_material = $16,
                handlebar_material = $17,
                weight = $18,
                image = $19,
                date_updated = $20
            WHERE cockpit_id = $21
            RETURNING *;
        `;

        const values = [
            description,
            seatpost_diameter,
            seatpost_length,
            seat_clamp_type,
            handlebar_length,
            handlebar_clamp_diameter,
            handlebar_type,
            stem_clamp_diameter,
            stem_length,
            stem_angle,
            fork_upper_diameter,
            headset_type,
            headset_upper_diameter,
            headset_lower_diameter,
            headset_cup_type,
            stem_material,
            handlebar_material,
            weight,
            item_image,
            new Date(),
            id
        ];

        const updatedItem = await pool.query(query, values);

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
    updateFrameItem,
    updateForkItem,
    updateGroupsetItem,
    updateWheelsetItem,
    updateCockpitItem
};