const pool = require('../config/db');
require('dotenv').config();

const getWaitlistItems = async (req, res) => {
    try {
        const query = `
            SELECT 
                w.waitlist_item_id,
                i.item_id,       
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

// Add to Frame
const addFrame = async (req, res) => {
    const {
        waitlist_item_id,
        item_id,
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

    const image = req.file ? req.file.buffer : null;

    try {
        const query = `
            INSERT INTO frame (
                item_id, description, frame_size, head_tube_type, 
                head_tube_upper_diameter, head_tube_lower_diameter, 
                seatpost_diameter, axle_type, axle_width, 
                bottom_bracket_type, bottom_bracket_diameter, 
                rotor_size, max_tire_width, brake_mount, 
                cable_routing, material, weight, image, date_created, 
                date_updated
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, 
                $10, $11, $12, $13, $14, $15, $16, $17,
                $18, $19, $20
            ) RETURNING *;
        `;

        const values = [
            item_id,
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
            image,
            new Date(),
            new Date()
        ];


        const result = await pool.query(query, values);

        // Update bb_bu_status in items table
        const updateQuery = `UPDATE items SET bb_bu_status = true, add_part = false WHERE item_id = $1;`;
        await pool.query(updateQuery, [item_id]);

        // Delete the waitlist item
        const deleteQuery = `DELETE FROM waitlist WHERE waitlist_item_id = $1;`;
        await pool.query(deleteQuery, [waitlist_item_id]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding frame:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Add to Frame
const addFork = async (req, res) => {
    const {
        waitlist_item_id,
        item_id,
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

    const image = req.file ? req.file.buffer : null;

    try {
        const query = `
            INSERT INTO fork (
                item_id, description, fork_size, fork_tube_type, 
                fork_tube_upper_diameter, fork_tube_lower_diameter, 
                axle_type, axle_width, suspension_type, rotor_size, 
                max_tire_width, brake_mount, material, weight, image, 
                date_created, date_updated
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, 
                $10, $11, $12, $13, $14, $15, $16, $17
            ) RETURNING *;
        `;

        const values = [
            item_id,
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
            image,
            new Date(),
            new Date()
        ];


        const result = await pool.query(query, values);

        // Update bb_bu_status in items table
        const updateQuery = `UPDATE items SET bb_bu_status = true, add_part = false WHERE item_id = $1;`;
        await pool.query(updateQuery, [item_id]);

        // Delete the waitlist item
        const deleteQuery = `DELETE FROM waitlist WHERE waitlist_item_id = $1;`;
        await pool.query(deleteQuery, [waitlist_item_id]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding fork:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Add to Groupset
const addGroupset = async (req, res) => {
    const {
        waitlist_item_id,
        item_id,
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

    const image = req.file ? req.file.buffer : null;

    try {
        const query = `
            INSERT INTO groupset (
                item_id, description, chainring_speed, crank_arm_length,
                front_derailleur_speed, rear_derailleur_speed, cassette_type,
                cassette_speed, chain_speed, bottom_bracket_type,
                bottom_bracket_diameter, brake_type, axle_type, weight, image, 
                date_created, date_updated
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, 
                $10, $11, $12, $13, $14, $15, $16, $17
            ) RETURNING *;
        `;

        const values = [
            item_id,
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
            image,
            new Date(),
            new Date()
        ];


        const result = await pool.query(query, values);

        // Update bb_bu_status in items table
        const updateQuery = `UPDATE items SET bb_bu_status = true, add_part = false WHERE item_id = $1;`;
        await pool.query(updateQuery, [item_id]);

        // Delete the waitlist item
        const deleteQuery = `DELETE FROM waitlist WHERE waitlist_item_id = $1;`;
        await pool.query(deleteQuery, [waitlist_item_id]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding groupset:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getWaitlistItems,
    addFrame,
    addFork,
    addGroupset
};