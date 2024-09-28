const pool = require('../config/db');

// Get parts item count
const getPartsCount = async (req, res) => {
    const { partType } = req.params;

    const validPartTypes = [
        'frame', 'fork', 'groupset', 'wheelset',
        'cockpit', 'headset', 'handlebar', 'stem', 'hubs'
    ];

    // Validate the partType against the allowed values
    if (!validPartTypes.includes(partType)) {
        return res.status(400).json({ error: 'Invalid part type' });
    }

    try {
        // Use a parameterized query to avoid SQL injection
        const query = `
        SELECT 
            COUNT(*) AS count
        FROM 
            ${partType} p
        JOIN 
            items i
        ON 
            p.item_id = i.item_id
        WHERE 
            i.status = true 
            AND p.status = true;
        `;

        const result = await pool.query(query);

        // Check if the result has any rows
        if (result.rows.length === 0) {
            return res.json({ count: 0 }); // Return 0 count if no rows found
        }

        res.json({ count: parseInt(result.rows[0].count, 10) });
    } catch (error) {
        console.error(`Error fetching count for ${partType}:`, error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get frame items
const getFrameItems = async (req, res) => {
    const { archived } = req.query;

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
                AND f.status = $1;
        `;

        const { rows } = await pool.query(query, [archived === 'true']);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching frame items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get fork items
const getForkItems = async (req, res) => {
    const { archived } = req.query;

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
                AND f.status = $1;
        `;

        const { rows } = await pool.query(query, [archived === 'true']);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching fork items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get groupset items
const getGroupsetItems = async (req, res) => {
    const { archived } = req.query;

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
                    AND g.status = $1;
        `;

        const { rows } = await pool.query(query, [archived === 'true']);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching groupset items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get wheelset items
const getWheelsetItems = async (req, res) => {
    const { archived } = req.query;

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
                    AND w.status = $1;
        `;

        const { rows } = await pool.query(query, [archived === 'true']);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching wheelset items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get cockpit items
const getCockpitItems = async (req, res) => {
    const { archived } = req.query;

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
                    AND c.status = $1;
        `;

        const { rows } = await pool.query(query, [archived === 'true']);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching cockpit items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get headset items
const getHeadsetItems = async (req, res) => {
    const { archived } = req.query;

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
                    AND h.status = $1;
        `;

        const { rows } = await pool.query(query, [archived === 'true']);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching headset items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get handlebar items
const getHandlebarItems = async (req, res) => {
    const { archived } = req.query;

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
                    AND h.status = $1;
        `;

        const { rows } = await pool.query(query, [archived === 'true']);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching handlebar items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get stem items
const getStemItems = async (req, res) => {
    const { archived } = req.query;

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
                    AND s.status = $1;
        `;

        const { rows } = await pool.query(query, [archived === 'true']);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching stem items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get hubs items
const getHubsItems = async (req, res) => {
    const { archived } = req.query;

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
                    AND h.status = $1;
        `;

        const { rows } = await pool.query(query, [archived === 'true']);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching hubs items:', error);
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

// Update headset item
const updateHeadsetItem = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            description,
            headset_type,
            headset_upper_diameter,
            headset_lower_diameter,
            headset_cup_type,
            material,
            weight,
        } = req.body;

        const item_image = req.file ? req.file.buffer : null;

        const query = `
            UPDATE headset
            SET 
                description = $1,
                headset_type = $2,
                headset_upper_diameter = $3,
                headset_lower_diameter = $4,
                headset_cup_type = $5,
                material = $6,
                weight = $7,
                image = $8,
                date_updated = $9
            WHERE headset_id = $10
            RETURNING *;
        `;

        const values = [
            description,
            headset_type,
            headset_upper_diameter,
            headset_lower_diameter,
            headset_cup_type,
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

// Update handlebar item
const updateHandlebarItem = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            description,
            handlebar_length,
            handlebar_clamp_diameter,
            handlebar_type,
            material,
            weight,
        } = req.body;

        const item_image = req.file ? req.file.buffer : null;

        const query = `
            UPDATE handlebar
            SET 
                description = $1,
                handlebar_length = $2,
                handlebar_clamp_diameter = $3,
                handlebar_type = $4,
                material = $5,
                weight = $6,
                image = $7,
                date_updated = $8
            WHERE handlebar_id = $9
            RETURNING *;
        `;

        const values = [
            description,
            handlebar_length,
            handlebar_clamp_diameter,
            handlebar_type,
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

// Update stem item
const updateStemItem = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            description,
            stem_clamp_diameter,
            stem_length,
            stem_angle,
            material,
            weight,
        } = req.body;

        const item_image = req.file ? req.file.buffer : null;

        const query = `
            UPDATE stem
            SET 
                description = $1,
                stem_clamp_diameter = $2,
                stem_length = $3,
                stem_angle = $4,
                material = $5,
                weight = $6,
                image = $7,
                date_updated = $8
            WHERE stem_id = $9
            RETURNING *;
        `;

        const values = [
            description,
            stem_clamp_diameter,
            stem_length,
            stem_angle,
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

// Update hubs item
const updateHubsItem = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            description,
            hub_type,
            hub_speed,
            hub_holes,
            axle_type,
            rotor_type,
            material,
            weight,
        } = req.body;

        const item_image = req.file ? req.file.buffer : null;

        const query = `
            UPDATE hubs
            SET 
                description = $1,
                hub_type = $2,
                hub_speed = $3,
                hub_holes = $4,
                axle_type = $5,
                rotor_type = $6,
                material = $7,
                weight = $8,
                image = $9,
                date_updated = $10
            WHERE hub_id = $11
            RETURNING *;
        `;

        const values = [
            description,
            hub_type,
            hub_speed,
            hub_holes,
            axle_type,
            rotor_type,
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

// Archive  frame item
const archiveFrameItem = async (req, res) => {
    const { frame_id } = req.params;

    try {
        const query = `
            UPDATE frame
            SET status = false
            WHERE frame_id = $1
            RETURNING *; 
        `;
        const result = await pool.query(query, [frame_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({
            message: 'Item archived successfully',
            item: result.rows[0],
        });
    } catch (error) {
        console.error('Error archiving item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Archive fork item
const archiveForkItem = async (req, res) => {
    const { fork_id } = req.params;

    try {
        const query = `
            UPDATE fork
            SET status = false
            WHERE fork_id = $1
            RETURNING *; 
        `;
        const result = await pool.query(query, [fork_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({
            message: 'Item archived successfully',
            item: result.rows[0],
        });
    } catch (error) {
        console.error('Error archiving item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Archive groupset item
const archiveGroupsetItem = async (req, res) => {
    const { groupset_id } = req.params;

    try {
        const query = `
            UPDATE groupset
            SET status = false
            WHERE groupset_id = $1
            RETURNING *; 
        `;
        const result = await pool.query(query, [groupset_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({
            message: 'Item archived successfully',
            item: result.rows[0],
        });
    } catch (error) {
        console.error('Error archiving item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Archive wheelset item
const archiveWheelsetItem = async (req, res) => {
    const { wheelset_id } = req.params;

    try {
        const query = `
            UPDATE wheelset
            SET status = false
            WHERE wheelset_id = $1
            RETURNING *; 
        `;
        const result = await pool.query(query, [wheelset_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({
            message: 'Item archived successfully',
            item: result.rows[0],
        });
    } catch (error) {
        console.error('Error archiving item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Archive cockpit item
const archiveCockpitItem = async (req, res) => {
    const { cockpit_id } = req.params;

    try {
        const query = `
            UPDATE cockpit
            SET status = false
            WHERE cockpit_id = $1
            RETURNING *; 
        `;
        const result = await pool.query(query, [cockpit_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({
            message: 'Item archived successfully',
            item: result.rows[0],
        });
    } catch (error) {
        console.error('Error archiving item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Archive headset item
const archiveHeadsetItem = async (req, res) => {
    const { headset_id } = req.params;

    try {
        const query = `
            UPDATE headset
            SET status = false
            WHERE headset_id = $1
            RETURNING *; 
        `;
        const result = await pool.query(query, [headset_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({
            message: 'Item archived successfully',
            item: result.rows[0],
        });
    } catch (error) {
        console.error('Error archiving item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Archive handlebar item
const archiveHandlebarItem = async (req, res) => {
    const { handlebar_id } = req.params;

    try {
        const query = `
            UPDATE handlebar
            SET status = false
            WHERE handlebar_id = $1
            RETURNING *; 
        `;
        const result = await pool.query(query, [handlebar_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({
            message: 'Item archived successfully',
            item: result.rows[0],
        });
    } catch (error) {
        console.error('Error archiving item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Archive stem item
const archiveStemItem = async (req, res) => {
    const { stem_id } = req.params;

    try {
        const query = `
            UPDATE stem
            SET status = false
            WHERE stem_id = $1
            RETURNING *; 
        `;
        const result = await pool.query(query, [stem_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({
            message: 'Item archived successfully',
            item: result.rows[0],
        });
    } catch (error) {
        console.error('Error archiving item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Archive hubs item
const archiveHubsItem = async (req, res) => {
    const { hub_id } = req.params;

    try {
        const query = `
            UPDATE hubs
            SET status = false
            WHERE hub_id = $1
            RETURNING *; 
        `;
        const result = await pool.query(query, [hub_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({
            message: 'Item archived successfully',
            item: result.rows[0],
        });
    } catch (error) {
        console.error('Error archiving item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Restore frame item
const restoreFrameItem = async (req, res) => {
    const { frame_id } = req.params;

    try {
        const query = `
            UPDATE frame
            SET status = true
            WHERE frame_id = $1
            RETURNING *; 
        `;
        const result = await pool.query(query, [frame_id]);

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
        console.error('Error restoring item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Restore fork item
const restoreForkItem = async (req, res) => {
    const { fork_id } = req.params;

    try {
        const query = `
            UPDATE fork
            SET status = true
            WHERE fork_id = $1
            RETURNING *; 
        `;
        const result = await pool.query(query, [fork_id]);

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
        console.error('Error restoring item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Restore groupset item
const restoreGroupsetItem = async (req, res) => {
    const { groupset_id } = req.params;

    try {
        const query = `
            UPDATE groupset
            SET status = true
            WHERE groupset_id = $1
            RETURNING *; 
        `;
        const result = await pool.query(query, [groupset_id]);

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
        console.error('Error restoring item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Restore wheelset item
const restoreWheelsetItem = async (req, res) => {
    const { wheelset_id } = req.params;

    try {
        const query = `
            UPDATE wheelset
            SET status = true
            WHERE wheelset_id = $1
            RETURNING *; 
        `;
        const result = await pool.query(query, [wheelset_id]);

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
        console.error('Error restoring item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Restore cockpit item
const restoreCockpitItem = async (req, res) => {
    const { cockpit_id } = req.params;

    try {
        const query = `
            UPDATE cockpit
            SET status = true
            WHERE cockpit_id = $1
            RETURNING *; 
        `;
        const result = await pool.query(query, [cockpit_id]);

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
        console.error('Error restoring item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Restore headset item
const restoreHeadsetItem = async (req, res) => {
    const { headset_id } = req.params;

    try {
        const query = `
            UPDATE headset
            SET status = true
            WHERE headset_id = $1
            RETURNING *; 
        `;
        const result = await pool.query(query, [headset_id]);

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
        console.error('Error restoring item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Restore handlebar item
const restoreHandlebarItem = async (req, res) => {
    const { handlebar_id } = req.params;

    try {
        const query = `
            UPDATE handlebar
            SET status = true
            WHERE handlebar_id = $1
            RETURNING *; 
        `;
        const result = await pool.query(query, [handlebar_id]);

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
        console.error('Error restoring item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Restore stem item
const restoreStemItem = async (req, res) => {
    const { stem_id } = req.params;

    try {
        const query = `
            UPDATE stem
            SET status = true
            WHERE stem_id = $1
            RETURNING *; 
        `;
        const result = await pool.query(query, [stem_id]);

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
        console.error('Error restoring item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Restore hubs item
const restoreHubsItem = async (req, res) => {
    const { hub_id } = req.params;

    try {
        const query = `
            UPDATE hubs
            SET status = true
            WHERE hub_id = $1
            RETURNING *; 
        `;
        const result = await pool.query(query, [hub_id]);

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
        console.error('Error restoring item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete frame item
const deleteFrameItem = async (req, res) => {
    const { frame_id } = req.params;

    try {
        const getItemQuery = `
            SELECT item_id FROM frame WHERE frame_id = $1;
        `;
        const getItemResult = await pool.query(getItemQuery, [frame_id]);

        if (getItemResult.rowCount === 0) {
            return res.status(404).json({ message: 'Frame not found' });
        }

        const item_id = getItemResult.rows[0].item_id;

        const deleteQuery = `
            DELETE FROM frame WHERE frame_id = $1 RETURNING *;
        `;
        const deleteResult = await pool.query(deleteQuery, [frame_id]);

        const updateItemQuery = `
            UPDATE items
            SET bike_parts = NULL, bb_bu_status = FALSE
            WHERE item_id = $1
            RETURNING *;
        `;
        const updateResult = await pool.query(updateItemQuery, [item_id]);

        res.status(200).json({
            message: 'Item deleted successfully',
            frame: deleteResult.rows[0],
            updatedItem: updateResult.rows[0]
        });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete fork item
const deleteForkItem = async (req, res) => {
    const { fork_id } = req.params;

    try {
        const getItemQuery = `
            SELECT item_id FROM fork WHERE fork_id = $1;
        `;
        const getItemResult = await pool.query(getItemQuery, [fork_id]);

        if (getItemResult.rowCount === 0) {
            return res.status(404).json({ message: 'Fork not found' });
        }

        const item_id = getItemResult.rows[0].item_id;

        const deleteQuery = `
            DELETE FROM fork WHERE fork_id = $1 RETURNING *;
        `;
        const deleteResult = await pool.query(deleteQuery, [fork_id]);

        const updateItemQuery = `
            UPDATE items
            SET bike_parts = NULL, bb_bu_status = FALSE
            WHERE item_id = $1
            RETURNING *;
        `;
        const updateResult = await pool.query(updateItemQuery, [item_id]);

        res.status(200).json({
            message: 'Item deleted successfully',
            fork: deleteResult.rows[0],
            updatedItem: updateResult.rows[0]
        });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete groupset item
const deleteGroupsetItem = async (req, res) => {
    const { groupset_id } = req.params;

    try {
        const getItemQuery = `
            SELECT item_id FROM groupset WHERE groupset_id = $1;
        `;
        const getItemResult = await pool.query(getItemQuery, [groupset_id]);

        if (getItemResult.rowCount === 0) {
            return res.status(404).json({ message: 'Groupset not found' });
        }

        const item_id = getItemResult.rows[0].item_id;

        const deleteQuery = `
            DELETE FROM groupset WHERE groupset_id = $1 RETURNING *;
        `;
        const deleteResult = await pool.query(deleteQuery, [groupset_id]);

        const updateItemQuery = `
            UPDATE items
            SET bike_parts = NULL, bb_bu_status = FALSE
            WHERE item_id = $1
            RETURNING *;
        `;
        const updateResult = await pool.query(updateItemQuery, [item_id]);

        res.status(200).json({
            message: 'Item deleted successfully',
            groupset: deleteResult.rows[0],
            updatedItem: updateResult.rows[0]
        });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete wheelset item
const deleteWheelsetItem = async (req, res) => {
    const { wheelset_id } = req.params;

    try {
        const getItemQuery = `
            SELECT item_id FROM wheelset WHERE wheelset_id = $1;
        `;
        const getItemResult = await pool.query(getItemQuery, [wheelset_id]);

        if (getItemResult.rowCount === 0) {
            return res.status(404).json({ message: 'Wheelset not found' });
        }

        const item_id = getItemResult.rows[0].item_id;

        const deleteQuery = `
            DELETE FROM wheelset WHERE wheelset_id = $1 RETURNING *;
        `;
        const deleteResult = await pool.query(deleteQuery, [wheelset_id]);

        const updateItemQuery = `
            UPDATE items
            SET bike_parts = NULL, bb_bu_status = FALSE
            WHERE item_id = $1
            RETURNING *;
        `;
        const updateResult = await pool.query(updateItemQuery, [item_id]);

        res.status(200).json({
            message: 'Item deleted successfully',
            wheelset: deleteResult.rows[0],
            updatedItem: updateResult.rows[0]
        });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete cockpit item
const deleteCockpitItem = async (req, res) => {
    const { cockpit_id } = req.params;

    try {
        const getItemQuery = `
            SELECT item_id FROM cockpit WHERE cockpit_id = $1;
        `;
        const getItemResult = await pool.query(getItemQuery, [cockpit_id]);

        if (getItemResult.rowCount === 0) {
            return res.status(404).json({ message: 'Cockpit not found' });
        }

        const item_id = getItemResult.rows[0].item_id;

        const deleteQuery = `
            DELETE FROM cockpit WHERE cockpit_id = $1 RETURNING *;
        `;
        const deleteResult = await pool.query(deleteQuery, [cockpit_id]);

        const updateItemQuery = `
            UPDATE items
            SET bike_parts = NULL, bb_bu_status = FALSE
            WHERE item_id = $1
            RETURNING *;
        `;
        const updateResult = await pool.query(updateItemQuery, [item_id]);

        res.status(200).json({
            message: 'Item deleted successfully',
            cockpit: deleteResult.rows[0],
            updatedItem: updateResult.rows[0]
        });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete headset item
const deleteHeadsetItem = async (req, res) => {
    const { headset_id } = req.params;

    try {
        const getItemQuery = `
            SELECT item_id FROM headset WHERE headset_id = $1;
        `;
        const getItemResult = await pool.query(getItemQuery, [headset_id]);

        if (getItemResult.rowCount === 0) {
            return res.status(404).json({ message: 'Headset not found' });
        }

        const item_id = getItemResult.rows[0].item_id;

        const deleteQuery = `
            DELETE FROM headset WHERE headset_id = $1 RETURNING *;
        `;
        const deleteResult = await pool.query(deleteQuery, [headset_id]);

        const updateItemQuery = `
            UPDATE items
            SET bike_parts = NULL, bb_bu_status = FALSE
            WHERE item_id = $1
            RETURNING *;
        `;
        const updateResult = await pool.query(updateItemQuery, [item_id]);

        res.status(200).json({
            message: 'Item deleted successfully',
            headset: deleteResult.rows[0],
            updatedItem: updateResult.rows[0]
        });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete handlebar item
const deleteHandlebarItem = async (req, res) => {
    const { handlebar_id } = req.params;

    try {
        const getItemQuery = `
            SELECT item_id FROM handlebar WHERE handlebar_id = $1;
        `;
        const getItemResult = await pool.query(getItemQuery, [handlebar_id]);

        if (getItemResult.rowCount === 0) {
            return res.status(404).json({ message: 'Handlebar not found' });
        }

        const item_id = getItemResult.rows[0].item_id;

        const deleteQuery = `
            DELETE FROM handlebar WHERE handlebar_id = $1 RETURNING *;
        `;
        const deleteResult = await pool.query(deleteQuery, [handlebar_id]);

        const updateItemQuery = `
            UPDATE items
            SET bike_parts = NULL, bb_bu_status = FALSE
            WHERE item_id = $1
            RETURNING *;
        `;
        const updateResult = await pool.query(updateItemQuery, [item_id]);

        res.status(200).json({
            message: 'Item deleted successfully',
            handlebar: deleteResult.rows[0],
            updatedItem: updateResult.rows[0]
        });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete stem item
const deleteStemItem = async (req, res) => {
    const { stem_id } = req.params;

    try {
        const getItemQuery = `
            SELECT item_id FROM stem WHERE stem_id = $1;
        `;
        const getItemResult = await pool.query(getItemQuery, [stem_id]);

        if (getItemResult.rowCount === 0) {
            return res.status(404).json({ message: 'Stem not found' });
        }

        const item_id = getItemResult.rows[0].item_id;

        const deleteQuery = `
            DELETE FROM stem WHERE stem_id = $1 RETURNING *;
        `;
        const deleteResult = await pool.query(deleteQuery, [stem_id]);

        const updateItemQuery = `
            UPDATE items
            SET bike_parts = NULL, bb_bu_status = FALSE
            WHERE item_id = $1
            RETURNING *;
        `;
        const updateResult = await pool.query(updateItemQuery, [item_id]);

        res.status(200).json({
            message: 'Item deleted successfully',
            stem: deleteResult.rows[0],
            updatedItem: updateResult.rows[0]
        });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete hubs item
const deleteHubsItem = async (req, res) => {
    const { hub_id } = req.params;

    try {
        const getItemQuery = `
            SELECT item_id FROM hubs WHERE hub_id = $1;
        `;
        const getItemResult = await pool.query(getItemQuery, [hub_id]);

        if (getItemResult.rowCount === 0) {
            return res.status(404).json({ message: 'Hub not found' });
        }

        const item_id = getItemResult.rows[0].item_id;

        const deleteQuery = `
            DELETE FROM hubs WHERE hub_id = $1 RETURNING *;
        `;
        const deleteResult = await pool.query(deleteQuery, [hub_id]);

        const updateItemQuery = `
            UPDATE items
            SET bike_parts = NULL, bb_bu_status = FALSE
            WHERE item_id = $1
            RETURNING *;
        `;
        const updateResult = await pool.query(updateItemQuery, [item_id]);

        res.status(200).json({
            message: 'Item deleted successfully',
            hubs: deleteResult.rows[0],
            updatedItem: updateResult.rows[0]
        });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = {
    getPartsCount,
    getFrameItems,
    getForkItems,
    getGroupsetItems,
    getWheelsetItems,
    getCockpitItems,
    getHeadsetItems,
    getHandlebarItems,
    getStemItems,
    getHubsItems,

    updateFrameItem,
    updateForkItem,
    updateGroupsetItem,
    updateWheelsetItem,
    updateCockpitItem,
    updateHeadsetItem,
    updateHandlebarItem,
    updateStemItem,
    updateHubsItem,

    archiveFrameItem,
    archiveForkItem,
    archiveGroupsetItem,
    archiveWheelsetItem,
    archiveCockpitItem,
    archiveHeadsetItem,
    archiveHandlebarItem,
    archiveStemItem,
    archiveHubsItem,

    restoreFrameItem,
    restoreForkItem,
    restoreGroupsetItem,
    restoreWheelsetItem,
    restoreCockpitItem,
    restoreHeadsetItem,
    restoreHandlebarItem,
    restoreStemItem,
    restoreHubsItem,

    deleteFrameItem,
    deleteForkItem,
    deleteGroupsetItem,
    deleteWheelsetItem,
    deleteCockpitItem,
    deleteHeadsetItem,
    deleteHandlebarItem,
    deleteStemItem,
    deleteHubsItem
};