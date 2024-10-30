const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');
require('dotenv').config();

const getPosUsers = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const query = `
            SELECT pos_id, pos_name, pos_status, date_created, date_updated 
            FROM pos_users
            WHERE is_deleted = false
            ORDER BY date_created DESC;
        `
        const { rows } = await pool.query(query);
        res.status(201).json({ posUsers: rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const addPosUser = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const { name, password } = req.body;
        const posId = "pos-" + uuidv4();
        const posName = name;
        const posPassword = password;
        const hashedPassword = await bcrypt.hash(posPassword, 10);
        const posStatus = "active"
        console.log(name);
        console.log(password);

        const query = `
            INSERT INTO pos_users (pos_id, pos_name, pos_password, pos_status)
            VALUES ($1, $2, $3, $4)
        `
        const values = [posId.toString(), posName, hashedPassword, posStatus];

        await pool.query(query, values);
        res.status(201).json({ message: 'User added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const editPosUserName = async (req, res) => {
    try {
        const token = req.cookies.token;
        const { id } = req.params;
        const { name } = req.body;

        console.log(id);
        console.log(name);

        // Update the `pos_name` in `pos_users`
        const userUpdateQuery = `
            UPDATE pos_users
            SET pos_name = $1, date_updated = NOW()
            WHERE pos_id = $2
        `;
        const userValues = [name, id];
        await pool.query(userUpdateQuery, userValues);

        // Update the `pos_name` in `pos_logs` for all logs with the given `pos_id`
        const logUpdateQuery = `
            UPDATE pos_logs
            SET pos_name = $1
            WHERE pos_id = $2
        `;
        const logValues = [name, id];
        await pool.query(logUpdateQuery, logValues);

        res.status(201).json({ message: 'User name updated successfully in both pos_users and pos_logs' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const editPosUserPassword = async (req, res) => {
    try {
        const token = req.cookies.token;
        const { id } = req.params
        console.log(id)
        const { password } = req.body;
        console.log(password);
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `
            UPDATE pos_users
            SET pos_password = $1, date_updated = NOW()
            WHERE pos_id = $2
        `
        const values = [hashedPassword, id];
        await pool.query(query, values);
        res.status(201).json({ message: 'User edited successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const editPosUserStatus = async (req, res) => {
    try {
        const token = req.cookies.token;
        const { id } = req.params;
        const { status } = req.body;
        console.log(status);
        const query = `
            UPDATE pos_users
            SET pos_status = $1, date_updated = NOW()
            WHERE pos_id = $2
        `
        const values = [status, id];
        await pool.query(query, values);
        res.status(201).json({ message: 'User edited successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deletePosUser = async (req, res) => {
    try {
        const token = req.cookies.token;
        const verifedToken = jwt.verify(token, process.env.JWT_SECRET);
        const email = verifedToken.email;

        const { id } = req.params;
        console.log(id);
        const { password } = req.body;
        let passwordError = false;

        const { rows } = await pool.query('SELECT * FROM admin WHERE admin_email = $1', [email]);
        if (!rows.length) return res.status(400).json({ error: 'User not found' });

        const user = rows[0];
        const isValid = await bcrypt.compare(password, user.admin_password);
        if (!isValid) {
            passwordError = true;
            res.status(201).json({ message: 'Incorrect password', passwordError: passwordError });
        } else {
            const query = `
                UPDATE pos_users
                SET is_deleted = true, date_updated = NOW()
                WHERE pos_id = $1
            `
            const values = [id];
            await pool.query(query, values);
            res.status(201).json({ message: 'User deleted successfully', passwordError: passwordError });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getPosUsersLogs = async (req, res) => {
    try {
        const { date } = req.query; // Get the date from the query parameter
        const selectedDate = date || new Date().toISOString().split('T')[0]; // Use current date if no date is provided

        const query = `
            SELECT 
                log_id,
                pos_name,
                login_time,
                logout_time
            FROM 
                pos_logs
            WHERE 
                DATE(login_time) = $1
            ORDER BY 
                login_time DESC;
        `;

        const { rows } = await pool.query(query, [selectedDate]); // Pass the selected date to the query
        res.json({ logs: rows }); // Send the result as JSON response
    } catch (error) {
        console.error('Error fetching POS user logs:', error.message);
        console.error(error.stack);
        res.status(500).json({ error: 'Failed to fetch POS user logs' });
    }
};

const getPosLogsDates = async (req, res) => {
    try {
        const query = `
            SELECT DISTINCT DATE(login_time) AS log_date
            FROM pos_logs
            ORDER BY log_date DESC;
        `;

        const { rows } = await pool.query(query);

        // Extract dates and send as an array of dates
        const dates = rows.map(row => row.log_date);
        res.json({ dates }); // Send the result as JSON response with only dates
    } catch (error) {
        console.error('Error fetching POS logs dates:', error.message);
        console.error(error.stack);
        res.status(500).json({ error: 'Failed to fetch POS logs dates' });
    }
};


module.exports = {
    getPosUsers,
    addPosUser,
    editPosUserName,
    editPosUserPassword,
    editPosUserStatus,
    deletePosUser,
    getPosUsersLogs,
    getPosLogsDates
}