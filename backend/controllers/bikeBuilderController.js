const pool = require('../config/db');
// uuid
const { v4: uuidv4 } = require('uuid');

// Get frame items
const getFrameItems = async (req, res) => {
    try {
        const { typeTag } = req.params;
        const query = `
            SELECT 
                f.*,
                i.item_name,
                i.item_price,
                i.stock_count,
                i.bike_parts,
                encode(f.image, 'base64') AS item_image
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
                AND i.is_deleted = false
                AND i.stock_count > 0
                AND f.status = true
                AND bt.bike_type_tag = $1;
        `;

        const result = await pool.query(query, [typeTag]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching frame items:', error);
        res.status(500).json({ error: "Error" });
    }
};

// Get fork items
const getForkItems = async (req, res) => {
    try {
        const { typeTag } = req.params;
        const query = `
            SELECT 
                f.*,
                i.item_name,
                i.item_price,
                i.stock_count,
                i.bike_parts,
                encode(f.image, 'base64') AS item_image
            FROM 
                fork f
            JOIN 
                items i
            ON 
                f.item_id = i.item_id
            JOIN 
                part_compatibility pc ON pc.part_id = f.fork_id
            JOIN 
                bike_types bt ON pc.bike_type_id = bt.bike_type_id
            WHERE 
                i.status = true 
                AND i.is_deleted = false
                AND i.stock_count > 0
                AND f.status = true
                AND bt.bike_type_tag = $1;
        `;

        const result = await pool.query(query, [typeTag]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching fork items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get groupset items
const getGroupsetItems = async (req, res) => {
    try {
        const { typeTag } = req.params;
        const query = `
            SELECT 
                g.*,
                i.item_name,
                i.item_price,
                i.stock_count,
                i.bike_parts,
                encode(g.image, 'base64') AS item_image
                FROM 
                    groupset g
                JOIN 
                    items i
                ON 
                    g.item_id = i.item_id
                JOIN 
                    part_compatibility pc ON pc.part_id = g.groupset_id
                JOIN 
                    bike_types bt ON pc.bike_type_id = bt.bike_type_id
                WHERE 
                    i.status = true 
                    AND i.is_deleted = false
                    AND i.stock_count > 0
                    AND g.status = true
                    AND bt.bike_type_tag = $1;
        `;

        const result = await pool.query(query, [typeTag]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching groupset items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get wheelset items
const getWheelsetItems = async (req, res) => {
    try {
        const { typeTag } = req.params;
        const query = `
            SELECT 
                w.*,
                i.item_name,
                i.item_price,
                i.stock_count,
                i.bike_parts,
                encode(w.image, 'base64') AS item_image
                FROM 
                    wheelset w
                JOIN 
                    items i
                ON 
                    w.item_id = i.item_id
                JOIN 
                    part_compatibility pc ON pc.part_id = w.wheelset_id
                JOIN 
                    bike_types bt ON pc.bike_type_id = bt.bike_type_id
                WHERE 
                    i.status = true 
                    AND i.is_deleted = false
                    AND i.stock_count > 0
                    AND w.status = true
                    AND bt.bike_type_tag = $1;
        `;

        const result = await pool.query(query, [typeTag]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching wheelset items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get seat items
const getSeatItems = async (req, res) => {
    try {
        const { typeTag } = req.params;
        const query = `
            SELECT 
                s.*,
                i.item_name,
                i.item_price,
                i.stock_count,
                i.bike_parts,
                encode(s.image, 'base64') AS item_image
                FROM 
                    seat s
                JOIN 
                    items i
                ON 
                    s.item_id = i.item_id
                JOIN 
                    part_compatibility pc ON pc.part_id = s.seat_id
                JOIN 
                    bike_types bt ON pc.bike_type_id = bt.bike_type_id
                WHERE 
                    i.status = true 
                    AND i.is_deleted = false
                    AND i.stock_count > 0
                    AND s.status = true
                    AND bt.bike_type_tag = $1;
        `;

        const result = await pool.query(query, [typeTag]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching seat items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get cockpit items
const getCockpitItems = async (req, res) => {
    try {
        const { typeTag } = req.params;
        const query = `
            SELECT 
                c.*,
                i.item_name,
                i.item_price,
                i.stock_count,
                i.bike_parts,
                encode(c.image, 'base64') AS item_image
                FROM 
                    cockpit c
                JOIN 
                    items i
                ON 
                    c.item_id = i.item_id
                JOIN 
                    part_compatibility pc ON pc.part_id = c.cockpit_id
                JOIN 
                    bike_types bt ON pc.bike_type_id = bt.bike_type_id
                WHERE 
                    i.status = true 
                    AND i.is_deleted = false
                    AND i.stock_count > 0
                    AND c.status = true
                    AND bt.bike_type_tag = $1;
        `;

        const result = await pool.query(query, [typeTag]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching cockpit items:', error);
        res.status(500).json({ error: "Error" });
    }
};

function buildQuery(reference, filterCriteria) {
    // Convert filterCriteria into SQL conditions
    const conditions = Object.entries(filterCriteria)
        .map(([key, value]) => {
            // Wrap value in single quotes to ensure proper formatting
            if (key === 'tire_width') {
                return `${key}::FLOAT8 <= ${value}`;
            } else if (key === 'max_tire_width') {
                return `${key}::FLOAT8 >= ${value}`;
            } else {
                return `${key} = '${value}'`;
            }
        })
        .join(" AND ");

    // Construct the main query
    const query = `
        SELECT 
            ${reference.charAt(0)}.*,
            i.item_name,
            i.item_price,
            i.stock_count,
            i.bike_parts,
            encode(${reference.charAt(0)}.image, 'base64') AS item_image,
            i.total_rating,
            i.reviews_count
        FROM 
            ${reference} ${reference.charAt(0)}
        JOIN 
            items i
        ON 
            ${reference.charAt(0)}.item_id = i.item_id
        WHERE 
            i.status = true 
            AND i.is_deleted = false
            AND  ${reference.charAt(0)}.status = true
            ${conditions ? `AND ${conditions}` : ''}
    `;

    return query;
}

const getAnyItems = async (req, res) => {
    try {
        const { reference } = req.params;
        const { filterValues } = req.query;
        const query = buildQuery(reference, filterValues);
        const { rows } = await pool.query(query);
        res.status(200).json({ parts: rows });
    } catch (error) {
        res.status(500).json({ message: "Error" })
    }
}

const getNewStockCounts = async (req, res) => {
    try {
        const { ids } = req.body; // Expecting { ids: [1, 2, 3, ...] }

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: 'Invalid or missing item IDs.' });
        }

        const query = `
            SELECT 
                i.item_id,
                i.stock_count
            FROM 
                items i
            WHERE 
                i.item_id = ANY($1) 
                AND i.status = true 
                AND i.is_deleted = false;
        `;

        const result = await pool.query(query, [ids]); // Pass the ids array as parameter
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching stock counts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getItemReviews = async (req, res) => {
    try {
        const { itemId } = req.params;

        const query = `
            SELECT
                u.name,
                u.profile_picture,
                r.rating,
                r.comment,
                r.date_created,
                COALESCE(encode(r.image, 'base64'), null) AS review_image
            FROM reviews r
            JOIN users u ON r.user_id = u.google_id
            WHERE r.item_id = $1
        `
        const { rows } = await pool.query(query, [itemId]);
        res.status(200).json({ reviews: rows });
    } catch (error) {
        res.status(500).json({ message: "Error" });
    }
}

const saveBikeBuild = async (req, res) => {
    try{
        const { bbDetails } = req.body;
        const { image, build_id, build_price, frameId, forkId, groupsetId, wheelsetId, seatId, cockpitId } = bbDetails;

        const buildId = 'build-' + uuidv4();
        const buildName = build_id;
        const buildImage = image;
        const buildPrice = build_price;

        const query = `
            INSERT INTO bike_builds (build_id, build_name, build_image, build_price, frame_id, fork_id, groupset_id, wheelset_id, seat_id, cockpit_id) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;
        const values = [buildId, buildName, buildImage, buildPrice, frameId, forkId, groupsetId, wheelsetId, seatId, cockpitId];
        await pool.query(query, values);
        res.status(200).json({ message: 'Bike build saved successfully!' });
    } 
    catch (error) {
        res.status(500).json({ message: "Error" });
    }
}

module.exports = {
    getFrameItems,
    getForkItems,
    getGroupsetItems,
    getWheelsetItems,
    getSeatItems,
    getCockpitItems,
    getAnyItems,
    getNewStockCounts,
    getItemReviews,
    saveBikeBuild
};
