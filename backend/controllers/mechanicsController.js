const pool = require('../config/db');

const getAllMechanics = async (req, res) => {
    try {
        const query = `
            SELECT * 
            FROM mechanics 
            WHERE status = true
            ORDER BY mechanic_name ASC
        `
        const { rows } = await pool.query(query);
        res.json({ mechanics: rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const addMechanic = async (req, res) => {
    try {
        const { name } = req.body;
        const query = `
            INSERT INTO mechanics (mechanic_name)
            VALUES ($1)
        `;

        const values = [name];

        await pool.query(query, values);
        res.status(201).json({ message: 'Success' });
    } catch (error) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

module.exports = {
    getAllMechanics,
    addMechanic
}