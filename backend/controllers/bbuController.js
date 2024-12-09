const pool = require('../config/db');

const getBikeTypes = async (req, res) => {
    try {
        const query = `
            SELECT 
                *,
                SPLIT_PART(bike_type_name, ' ', 1) AS fname,
                encode(bike_type_image, 'base64') AS bike_type_image
            FROM bike_types
            ORDER BY bike_type_id ASC
            ;
        `
        const { rows } = await pool.query(query);
        res.status(200).json({ bikeTypes: rows });
    } catch (error) {
        res.status(500).json({ error: "Error" });
    }
}

const getAllParts = async (req, res) => {
    try {
        const query = `
            SELECT
                *
            FROM all_parts;
        `
        const { rows } = await pool.query(query);
        res.status(200).json({ parts: rows });
    } catch (error) {
        res.status(500).json({ error: "Error" });
    }
}

const addBikeType = async (req, res) => {
    try {
        const { name } = req.body;
        const image = req.file ? req.file.buffer : null;

        const bikeTypeTag = name.charAt(0).toLowerCase() + 'b';
        const query = `
            INSERT INTO bike_types (bike_type_name, bike_type_tag, bike_type_image) 
            VALUES ($1, $2, $3);
        `
        await pool.query(query, [name, bikeTypeTag, image]);
        res.status(201).json({ message: 'Bike type added successfully' });
    } catch (error) {
        res.status(500).json({ error: "Error" });
    }
}

const editBikeType = async (req, res) => {
    try {
        const { bikeTypeId } = req.params;
        const image = req.file ? req.file.buffer : null;

        const query = `
            UPDATE bike_types
            SET bike_type_image = $1
            WHERE bike_type_id = $2;
        `
        await pool.query(query, [image, bikeTypeId]);
        res.status(200).json({ message: 'Bike type updated successfully' });
    } catch (error) {
        res.status(500).json({ error: "Error" });
    }
}

const deleteBikeType = async (req, res) => {
    try {
        const { bikeTypeId } = req.params;
        const findTagQuery = `
            SELECT bike_type_tag
            FROM bike_types
            WHERE bike_type_id = $1;
        `
        const { rows } = await pool.query(findTagQuery, [bikeTypeId]);
        const bikeTypeTag = rows[0].bike_type_tag;

        if(bikeTypeTag === 'mtb') {
            return res.status(400).json({ error: 'Cannot delete default bike type' });
        }

        const updateQuery = `
            UPDATE part_compatibility
            SET bike_type_id = 1
            WHERE bike_type_id = $1;
        `
        await pool.query(updateQuery, [bikeTypeId]);

        const query = `
            DELETE FROM bike_types
            WHERE bike_type_id = $1;
        `
        await pool.query(query, [bikeTypeId]);
        res.status(200).json({ message: 'Bike type deleted successfully' });
} catch (error) {
        res.status(500).json({ error: "Error" });
    }
}

// Get parts item count
const getPartsCount = async (req, res) => {
    const { partType, bikeType } = req.params;

    const validPartTypes = [
        'frame', 'fork', 'groupset', 'wheelset', 'seat',
        'cockpit'
    ];

    // Validate the partType against the allowed values
    if (!validPartTypes.includes(partType)) {
        return res.status(400).json({ error: 'Invalid part type' });
    }

    try {
        // Step 1: Get bike_type_id
        const getBikeTypeIdQuery = `
            SELECT
                bike_type_id
            FROM
                bike_types
            WHERE
                bike_type_tag = $1;
        `;
        const { rows } = await pool.query(getBikeTypeIdQuery, [bikeType]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Bike type not found' });
        }

        const bikeTypeId = rows[0].bike_type_id;

        // Step 2: Get count of parts for the given bike type
        const partIdColumn = `${partType}_id`; // Example: frame_id, fork_id

        const query = `
            SELECT 
                COUNT(*) AS count
            FROM 
                ${partType} p
            JOIN 
                items i ON p.item_id = i.item_id
            JOIN 
                part_compatibility pc ON pc.part_id = p.${partIdColumn}
            WHERE 
                i.status = true
                AND p.is_deleted = false
                AND p.status = true
                AND pc.bike_type_id = $1;
        `;

        const result = await pool.query(query, [bikeTypeId]);

        if (result.rows.length === 0) {
            return res.json({ count: 0 });
        }

        res.json({ count: parseInt(result.rows[0].count, 10) });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Get frame items
const getFrameItems = async (req, res) => {
    const { archived, bikeType } = req.query;

    try {
        const query = `
            SELECT 
                f.*,
                i.item_name,
                i.item_price,
                encode(f.image, 'base64') AS item_image,
                CASE 
                    WHEN i.total_rating = 0 AND i.reviews_count = 0 THEN 0
                    ELSE (i.total_rating::decimal / i.reviews_count)::decimal(10, 1)
                END AS average_rating,
                i.reviews_count
            FROM 
                frame f
            JOIN 
                items i ON f.item_id = i.item_id
            JOIN 
                part_compatibility pc ON pc.part_id = f.frame_id
            JOIN 
                bike_types bt ON pc.bike_type_id = bt.bike_type_id
            WHERE 
                i.status = true 
                AND f.status = $1
                AND f.is_deleted = false
                AND bt.bike_type_tag = $2
                AND pc.part_type = 'frame';
        `;

        const { rows } = await pool.query(query, [archived === 'true', bikeType]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error" });
    }
};


// Get fork items
const getForkItems = async (req, res) => {
    const { archived, bikeType } = req.query;

    try {
        const query = `
            SELECT 
                f.*,
                i.item_name,
                i.item_price,
                encode(f.image, 'base64') AS item_image,
                CASE 
                    WHEN i.total_rating = 0 AND i.reviews_count = 0 THEN 0
                    ELSE (i.total_rating::decimal / i.reviews_count)::decimal(10, 1)
                END AS average_rating,
                i.reviews_count
            FROM 
                fork f
            JOIN 
                items i ON f.item_id = i.item_id
            JOIN 
                part_compatibility pc ON pc.part_id = f.fork_id
            JOIN 
                bike_types bt ON pc.bike_type_id = bt.bike_type_id
            WHERE 
                i.status = true 
                AND f.status = $1
                AND f.is_deleted = false
                AND bt.bike_type_tag = $2
                AND pc.part_type = 'fork';
        `;

        const { rows } = await pool.query(query, [archived === 'true', bikeType]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Get groupset items
const getGroupsetItems = async (req, res) => {
    const { archived, bikeType } = req.query;

    try {
        const query = `
            SELECT 
                g.*,
                i.item_name,
                i.item_price,
                encode(g.image, 'base64') AS item_image,
                CASE 
                    WHEN i.total_rating = 0 AND i.reviews_count = 0 THEN 0
                    ELSE (i.total_rating::decimal / i.reviews_count)::decimal(10, 1)
                END AS average_rating,
                i.reviews_count
            FROM 
                groupset g
            JOIN 
                items i ON g.item_id = i.item_id
            JOIN 
                part_compatibility pc ON pc.part_id = g.groupset_id
            JOIN 
                bike_types bt ON pc.bike_type_id = bt.bike_type_id
            WHERE 
                i.status = true 
                AND g.status = $1
                AND g.is_deleted = false
                AND bt.bike_type_tag = $2
                AND pc.part_type = 'groupset';
        `;

        const { rows } = await pool.query(query, [archived === 'true', bikeType]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Get wheelset items
const getWheelsetItems = async (req, res) => {
    const { archived, bikeType } = req.query;

    try {
        const query = `
            SELECT 
                w.*,
                i.item_name,
                i.item_price,
                encode(w.image, 'base64') AS item_image,
                CASE 
                    WHEN i.total_rating = 0 AND i.reviews_count = 0 THEN 0
                    ELSE (i.total_rating::decimal / i.reviews_count)::decimal(10, 1)
                END AS average_rating,
                i.reviews_count
            FROM 
                wheelset w
            JOIN 
                items i ON w.item_id = i.item_id
            JOIN 
                part_compatibility pc ON pc.part_id = w.wheelset_id
            JOIN 
                bike_types bt ON pc.bike_type_id = bt.bike_type_id
            WHERE 
                i.status = true 
                AND w.status = $1
                AND w.is_deleted = false
                AND bt.bike_type_tag = $2
                AND pc.part_type = 'wheelset';
        `;

        const { rows } = await pool.query(query, [archived === 'true', bikeType]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Get seat items
const getSeatItems = async (req, res) => {
    const { archived, bikeType } = req.query;

    try {
        const query = `
            SELECT 
                s.*,
                i.item_name,
                i.item_price,
                encode(s.image, 'base64') AS item_image,
                CASE 
                    WHEN i.total_rating = 0 AND i.reviews_count = 0 THEN 0
                    ELSE (i.total_rating::decimal / i.reviews_count)::decimal(10, 1)
                END AS average_rating,
                i.reviews_count
            FROM 
                seat s
            JOIN 
                items i ON s.item_id = i.item_id
            JOIN 
                part_compatibility pc ON pc.part_id = s.seat_id
            JOIN 
                bike_types bt ON pc.bike_type_id = bt.bike_type_id
            WHERE 
                i.status = true 
                AND s.status = $1
                AND s.is_deleted = false
                AND bt.bike_type_tag = $2
                AND pc.part_type = 'seat';
        `;

        const { rows } = await pool.query(query, [archived === 'true', bikeType]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Get cockpit items
const getCockpitItems = async (req, res) => {
    const { archived, bikeType } = req.query;

    try {
        const query = `
            SELECT 
                c.*,
                i.item_name,
                i.item_price,
                encode(c.image, 'base64') AS item_image,
                CASE 
                    WHEN i.total_rating = 0 AND i.reviews_count = 0 THEN 0
                    ELSE (i.total_rating::decimal / i.reviews_count)::decimal(10, 1)
                END AS average_rating,
                i.reviews_count
            FROM 
                cockpit c
            JOIN 
                items i ON c.item_id = i.item_id
            JOIN 
                part_compatibility pc ON pc.part_id = c.cockpit_id
            JOIN 
                bike_types bt ON pc.bike_type_id = bt.bike_type_id
            WHERE 
                i.status = true 
                AND c.status = $1
                AND c.is_deleted = false
                AND bt.bike_type_tag = $2
                AND pc.part_type = 'cockpit';
        `;

        const { rows } = await pool.query(query, [archived === 'true', bikeType]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Update frame item
const updateFrameItem = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            description,
            purpose,
            frame_size,
            head_tube_type,
            head_tube_upper_diameter,
            head_tube_lower_diameter,
            seatpost_diameter,
            axle_type,
            axle_diameter,
            bottom_bracket_type,
            bottom_bracket_width,
            rotor_size,
            max_tire_width,
            rear_hub_width,
            material,
        } = req.body;

        const item_image = req.file ? req.file.buffer : null;

        const query = `
            UPDATE frame
            SET 
                description = $1,
                purpose = $2,
                frame_size = $3,
                head_tube_type = $4,
                head_tube_upper_diameter = $5,
                head_tube_lower_diameter = $6,
                seatpost_diameter = $7,
                axle_type = $8,
                axle_diameter = $9,
                bottom_bracket_type = $10,
                bottom_bracket_width = $11,
                rotor_size = $12,
                max_tire_width = $13,
                rear_hub_width = $14,
                material = $15,
                image = $16,
                date_updated = $17
            WHERE frame_id = $18
            RETURNING *;
        `;

        const values = [
            description,
            purpose,
            frame_size,
            head_tube_type,
            head_tube_upper_diameter,
            head_tube_lower_diameter,
            seatpost_diameter,
            axle_type,
            axle_diameter,
            bottom_bracket_type,
            bottom_bracket_width,
            rotor_size,
            Number(max_tire_width),
            rear_hub_width,
            material,
            item_image,
            new Date(Date.now()).toLocaleString("en-US", { timeZone: "Asia/Manila" }),
            id,
        ];

        const updatedItem = await pool.query(query, values);

        res.status(200).json({ message: 'Item updated successfully', item: updatedItem.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating the item' });
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
            fork_travel,
            axle_type,
            axle_diameter,
            suspension_type,
            rotor_size,
            max_tire_width,
            front_hub_width,
            material,
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
                fork_travel = $6,
                axle_type = $7,
                axle_diameter = $8,
                suspension_type = $9,
                rotor_size = $10,
                max_tire_width = $11,
                front_hub_width = $12,
                material = $13,
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
            fork_travel,
            axle_type,
            axle_diameter,
            suspension_type,
            rotor_size,
            Number(max_tire_width),
            front_hub_width,
            material,
            item_image,
            new Date(Date.now()).toLocaleString("en-US", { timeZone: "Asia/Manila" }),
            id
        ];

        const updatedItem = await pool.query(query, values);

        res.status(200).json({ message: 'Item updated successfully', item: updatedItem.rows[0] });
    } catch (error) {
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
            bottom_bracket_width,
            brake_type,
            rotor_mount_type,
            rotor_size,
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
                bottom_bracket_width = $10,
                brake_type = $11  ,
                rotor_mount_type = $12,
                rotor_size = $13,
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
            bottom_bracket_width,
            brake_type,
            rotor_mount_type,
            rotor_size,
            item_image,
            new Date(Date.now()).toLocaleString("en-US", { timeZone: "Asia/Manila" }),
            id
        ];

        const updatedItem = await pool.query(query, values);

        res.status(200).json({ message: 'Item updated successfully', item: updatedItem.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating the item', error });
    }
};

// Update wheelset item
const updateWheelsetItem = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            description,
            hub_rotor_type,
            hub_cassette_type,
            hub_holes,
            front_hub_width,
            front_hub_axle_type,
            front_hub_axle_diameter,
            rear_hub_width,
            rear_hub_axle_type,
            rear_hub_axle_diameter,
            rear_hub_speed,
            tire_size,
            tire_width,
            rim_spokes,
        } = req.body;

        const item_image = req.file ? req.file.buffer : null;

        const query = `
            UPDATE wheelset
            SET 
                description = $1,
                hub_rotor_type = $2,
                hub_cassette_type = $3,
                hub_holes = $4,
                front_hub_width = $5,
                front_hub_axle_type = $6,
                front_hub_axle_diameter = $7,
                rear_hub_width = $8,
                rear_hub_axle_type = $9,
                rear_hub_axle_diameter = $10,
                rear_hub_speed = $11,
                tire_size = $12,
                tire_width = $13,
                rim_spokes = $14,
                image = $15,
                date_updated = $16
            WHERE wheelset_id = $17
            RETURNING *;
        `;

        const values = [
            description,
            hub_rotor_type,
            hub_cassette_type,
            hub_holes,
            front_hub_width,
            front_hub_axle_type,
            front_hub_axle_diameter,
            rear_hub_width,
            rear_hub_axle_type,
            rear_hub_axle_diameter,
            rear_hub_speed,
            tire_size,
            Number(tire_width),
            rim_spokes,
            item_image,
            new Date(Date.now()).toLocaleString("en-US", { timeZone: "Asia/Manila" }),
            id
        ];

        const updatedItem = await pool.query(query, values);

        res.status(200).json({ message: 'Item updated successfully', item: updatedItem.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating the item', error });
    }
};

// Update seat item
const updateSeatItem = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            description,
            seatpost_diameter,
            seatpost_length,
            seat_clamp_type,
            saddle_material,
        } = req.body;

        const item_image = req.file ? req.file.buffer : null;

        const query = `
            UPDATE seat
            SET 
                description = $1,
                seatpost_diameter = $2,
                seatpost_length = $3,
                seat_clamp_type = $4,
                saddle_material = $5,
                image = $6,
                date_updated = $7
            WHERE seat_id = $8
            RETURNING *;
        `;

        const values = [
            description,
            seatpost_diameter,
            seatpost_length,
            seat_clamp_type,
            saddle_material,
            item_image,
            new Date(Date.now()).toLocaleString("en-US", { timeZone: "Asia/Manila" }),
            id
        ];

        const updatedItem = await pool.query(query, values);

        res.status(200).json({ message: 'Item updated successfully', item: updatedItem.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating the item', error });
    }
};

// Update cockpit item
const updateCockpitItem = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            description,
            handlebar_length,
            handlebar_clamp_diameter,
            handlebar_type,
            stem_clamp_diameter,
            stem_length,
            stem_angle,
            stem_fork_diameter,
            headset_type,
            headset_cup_type,
            headset_upper_diameter,
            headset_lower_diameter,
        } = req.body;

        const item_image = req.file ? req.file.buffer : null;

        const query = `
            UPDATE cockpit
            SET 
                description = $1,
                handlebar_length = $2,
                handlebar_clamp_diameter = $3,
                handlebar_type = $4,
                stem_clamp_diameter = $5,
                stem_length = $6,
                stem_angle = $7,
                stem_fork_diameter = $8,
                headset_type = $9,
                headset_cup_type = $10,
                headset_upper_diameter = $11,
                headset_lower_diameter = $12,
                image = $13,
                date_updated = $14
            WHERE cockpit_id = $15
            RETURNING *;
        `;

        const values = [
            description,
            handlebar_length,
            handlebar_clamp_diameter,
            handlebar_type,
            stem_clamp_diameter,
            stem_length,
            stem_angle,
            stem_fork_diameter,
            headset_type,
            headset_cup_type,
            headset_upper_diameter,
            headset_lower_diameter,
            item_image,
            new Date(Date.now()).toLocaleString("en-US", { timeZone: "Asia/Manila" }),
            id
        ];

        const updatedItem = await pool.query(query, values);

        res.status(200).json({ message: 'Item updated successfully', item: updatedItem.rows[0] });
    } catch (error) {
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
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Archive seat item
const archiveSeatItem = async (req, res) => {
    const { seat_id } = req.params;

    try {
        const query = `
            UPDATE seat
            SET status = false
            WHERE seat_id = $1
            RETURNING *; 
        `;
        const result = await pool.query(query, [seat_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({
            message: 'Item archived successfully',
            item: result.rows[0],
        });
    } catch (error) {
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
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Restore seat item
const restoreSeatItem = async (req, res) => {
    const { seat_id } = req.params;

    try {
        const query = `
            UPDATE seat
            SET status = true
            WHERE seat_id = $1
            RETURNING *; 
        `;
        const result = await pool.query(query, [seat_id]);

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
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete frame item
const deleteFrameItem = async (req, res) => {
    const { frame_id } = req.params;

    try {
        const getItemQuery = `
            SELECT item_id FROM frame WHERE frame_id = $1 AND is_deleted = false;
        `;
        const getItemResult = await pool.query(getItemQuery, [frame_id]);

        if (getItemResult.rowCount === 0) {
            return res.status(404).json({ message: 'Frame not found' });
        }

        const item_id = getItemResult.rows[0].item_id;

        const deleteQuery = `
            UPDATE frame SET is_deleted = true WHERE frame_id = $1;
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
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete fork item
const deleteForkItem = async (req, res) => {
    const { fork_id } = req.params;

    try {
        const getItemQuery = `
            SELECT item_id FROM fork WHERE fork_id = $1 AND is_deleted = false;
        `;
        const getItemResult = await pool.query(getItemQuery, [fork_id]);

        if (getItemResult.rowCount === 0) {
            return res.status(404).json({ message: 'Fork not found' });
        }

        const item_id = getItemResult.rows[0].item_id;

        const deleteQuery = `
            UPDATE fork SET is_deleted = true WHERE fork_id = $1;
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
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete groupset item
const deleteGroupsetItem = async (req, res) => {
    const { groupset_id } = req.params;

    try {
        const getItemQuery = `
            SELECT item_id FROM groupset WHERE groupset_id = $1 AND is_deleted = false;
        `;
        const getItemResult = await pool.query(getItemQuery, [groupset_id]);

        if (getItemResult.rowCount === 0) {
            return res.status(404).json({ message: 'Groupset not found' });
        }

        const item_id = getItemResult.rows[0].item_id;

        const deleteQuery = `
            UPDATE groupset SET is_deleted = true WHERE groupset_id = $1;
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
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete wheelset item
const deleteWheelsetItem = async (req, res) => {
    const { wheelset_id } = req.params;

    try {
        const getItemQuery = `
            SELECT item_id FROM wheelset WHERE wheelset_id = $1 AND is_deleted = false;
        `;
        const getItemResult = await pool.query(getItemQuery, [wheelset_id]);

        if (getItemResult.rowCount === 0) {
            return res.status(404).json({ message: 'Wheelset not found' });
        }

        const item_id = getItemResult.rows[0].item_id;

        const deleteQuery = `
            UPDATE wheelset SET is_deleted = true WHERE wheelset_id = $1;
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
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete seat item
const deleteSeatItem = async (req, res) => {
    const { seat_id } = req.params;

    try {
        const getItemQuery = `
            SELECT item_id FROM seat WHERE seat_id = $1 AND is_deleted = false;
        `;
        const getItemResult = await pool.query(getItemQuery, [seat_id]);

        if (getItemResult.rowCount === 0) {
            return res.status(404).json({ message: 'Seat not found' });
        }

        const item_id = getItemResult.rows[0].item_id;

        const deleteQuery = `
            UPDATE seat SET is_deleted = true WHERE seat_id = $1;
        `;
        const deleteResult = await pool.query(deleteQuery, [seat_id]);

        const updateItemQuery = `
            UPDATE items
            SET bike_parts = NULL, bb_bu_status = FALSE
            WHERE item_id = $1
            RETURNING *;
        `;
        const updateResult = await pool.query(updateItemQuery, [item_id]);

        res.status(200).json({
            message: 'Item deleted successfully',
            seat: deleteResult.rows[0],
            updatedItem: updateResult.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete cockpit item
const deleteCockpitItem = async (req, res) => {
    const { cockpit_id } = req.params;

    try {
        const getItemQuery = `
            SELECT item_id FROM cockpit WHERE cockpit_id = $1 AND is_deleted = false;
        `;
        const getItemResult = await pool.query(getItemQuery, [cockpit_id]);

        if (getItemResult.rowCount === 0) {
            return res.status(404).json({ message: 'Cockpit not found' });
        }

        const item_id = getItemResult.rows[0].item_id;

        const deleteQuery = `
            UPDATE cockpit SET is_deleted = true WHERE cockpit_id = $1;
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
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getPartSpecs = async (req, res) => {
    try {
        const { partName, specId } = req.params;
        let query;

        if(specId === '0'){
            query = `
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = $1 AND column_name NOT IN ('item_id', 'is_deleted', 'status', 'date_created', 'date_updated', 'description', 'material', 'image') AND column_name NOT LIKE '%_id'
                
            `
            const { rows } = await pool.query(query, [partName.toLowerCase()]);
            return res.status(200).json({ specs: rows });
        } else {
            query = `
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = $1 AND column_name NOT IN ('item_id', 'is_deleted', 'status', 'date_created', 'date_updated', 'description', 'material', 'image') AND column_name NOT LIKE '%_id'
                
            `
            const { rows } = await pool.query(query, [partName.toLowerCase()]);
            return res.status(200).json({ specs: rows });
        }
    } catch (error) {
        res.status(500).json({ error: "Error" });
    }
}

const getCompatibilitySpecs = async(req, res) => {
    try {
        const { bikeType } = req.params;

        if(!bikeType){
            bikeType = 'mtb';
        }
        
        const query = `
            SELECT cs.*, bt.bike_type_tag 
            FROM compatibility_specs cs
            JOIN bike_types bt ON cs.bike_type_id = bt.bike_type_id
            WHERE bt.bike_type_tag = $1;
            ;
        `
        const { rows } = await pool.query(query, [bikeType]);
        res.status(200).json({ specs: rows });
    } catch (error) {
        res.status(500).json({ error: "Error" });
    }
}

const addUpgraderSpecForm = async(req, res) => {
    try {
        const { bikeType, indPart, depPart, indSpec, depSpec } = req.body;

        const getBikeTypeIdQuery = `
            SELECT bike_type_id FROM bike_types WHERE bike_type_tag = $1;
        `
        const { rows } = await pool.query(getBikeTypeIdQuery, [bikeType]);
        const bikeTypeId = rows[0].bike_type_id;

        const insertOgQuery = `
            INSERT INTO compatibility_specs (bike_type_id, ref_spec_id, part_type_from, part_type_to, attribute_from, attribute_to)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const insertOgValues = [bikeTypeId, 0, indPart, depPart, indSpec, depSpec];
        const insertRows = await pool.query(insertOgQuery, insertOgValues);

        const insertedRowId = insertRows.rows[0].spec_id;
        const insertRefQuery = `
            INSERT INTO compatibility_specs (bike_type_id, ref_spec_id, part_type_from, part_type_to, attribute_from, attribute_to)
            VALUES ($1, $2, $4, $3, $6, $5)
            RETURNING *;
        `;
        const insertRefValues = [bikeTypeId, insertedRowId, indPart, depPart, indSpec, depSpec];
        await pool.query(insertRefQuery, insertRefValues);

        res.status(200).json({ message: 'Upgrader spec added successfully' });
    } catch (error) {
        res.status(500).json({ error: "Error" });
    }
}

const updateUpgraderSpecForm = async (req, res) => {
    try {
        const { specId } = req.params;
        const { depPart, indSpec, depSpec } = req.body;


        const updateOgQuery = `
            UPDATE compatibility_specs
            SET part_type_to = $1, attribute_from = $2, attribute_to = $3
            WHERE spec_id = $4;
        `;
        const updateRefQuery = `
            UPDATE compatibility_specs
            SET part_type_from = $1, attribute_from = $3, attribute_to = $2
            WHERE ref_spec_id = $4;
        `;

        const updateOgValues = [depPart, indSpec, depSpec, specId];

        await pool.query(updateOgQuery, updateOgValues);
        await pool.query(updateRefQuery, updateOgValues);
        res.status(200).json({ message: 'Upgrader spec updated successfully' });
    } catch (error) {
        res.status(500).json({ error: "Error" });
    }
}

const deleteUpgraderSpecForm = async (req, res) => {
    try {
        const { specId } = req.params;

        const deleteOgQuery = `
            DELETE FROM compatibility_specs WHERE spec_id = $1;
        `;
        const deleteRefQuery = `
            DELETE FROM compatibility_specs WHERE ref_spec_id = $1;
        `;

        await pool.query(deleteOgQuery, [specId]);
        await pool.query(deleteRefQuery, [specId]);
        res.status(200).json({ message: 'Upgrader spec deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: "Error" });
    }

}

module.exports = {
    getBikeTypes,
    getPartSpecs,
    getAllParts,
    addBikeType,
    editBikeType,
    deleteBikeType,
    getPartsCount,
    getCompatibilitySpecs,

    addUpgraderSpecForm,
    updateUpgraderSpecForm,
    deleteUpgraderSpecForm,

    getFrameItems,
    getForkItems,
    getGroupsetItems,
    getWheelsetItems,
    getSeatItems,
    getCockpitItems,

    updateFrameItem,
    updateForkItem,
    updateGroupsetItem,
    updateWheelsetItem,
    updateSeatItem,
    updateCockpitItem,

    archiveFrameItem,
    archiveForkItem,
    archiveGroupsetItem,
    archiveWheelsetItem,
    archiveSeatItem,
    archiveCockpitItem,

    restoreFrameItem,
    restoreForkItem,
    restoreGroupsetItem,
    restoreWheelsetItem,
    restoreSeatItem,
    restoreCockpitItem,

    deleteFrameItem,
    deleteForkItem,
    deleteGroupsetItem,
    deleteWheelsetItem,
    deleteSeatItem,
    deleteCockpitItem,
};