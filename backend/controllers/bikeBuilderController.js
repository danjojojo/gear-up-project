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

// Get seat items
const getSeatItems = async (req, res) => {
    try {
        const query = `
            SELECT 
                s.*,
                i.item_name,
                i.item_price,
                encode(s.image, 'base64') AS item_image
                FROM 
                    seat s
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
        console.error('Error fetching seat items:', error);
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

function buildQuery(reference, filterCriteria) {
    // Convert filterCriteria into SQL conditions
    const conditions = Object.entries(filterCriteria)
        .map(([key, value]) => {
            // Wrap value in single quotes to ensure proper formatting
            return `${key} = '${value}'`;
        })
        .join(" AND ");

    // Construct the main query
    const query = `
        SELECT 
            ${reference.charAt(0)}.*,
            i.item_name,
            i.item_price,
            i.stock_count
            encode(${reference.charAt(0)}.image, 'base64') AS item_image
        FROM 
            ${reference} ${reference.charAt(0)}
        JOIN 
            items i
        ON 
            ${reference.charAt(0)}.item_id = i.item_id
        WHERE 
            i.status = true 
            AND $2.status = true
            ${conditions ? `AND ${conditions}` : ''}
    `;

    return query;
}

const getAnyItems = async (req, res) => {
    try {
        const {reference} = req.params;
        const {filterValues} = req.query;

        const query = buildQuery(reference, filterValues);
        console.log(query);
        const { rows } = await pool.query(query);
        console.log(rows);
        res.status(200).json({ parts : rows});
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
}

module.exports = {
    getFrameItems,
    getForkItems,
    getGroupsetItems,
    getWheelsetItems,
    getSeatItems,
    getCockpitItems,
    getAnyItems
};
