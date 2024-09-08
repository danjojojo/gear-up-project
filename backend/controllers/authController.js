const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

const checkAdminExists = async (req, res) => {
    try {
      const { rowCount } = await pool.query('SELECT * FROM admin');
      res.json({ exists: rowCount > 0 });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };


const registerUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const { rows } = await pool.query('INSERT INTO admin (admin_email, admin_password) VALUES ($1, $2) RETURNING *', [email, hashedPassword]);
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    try {
        const { rows } = await pool.query('SELECT * FROM admin WHERE admin_email = $1', [email]);
        if (!rows.length) return res.status(400).json({ error: 'User not found' });

        const user = rows[0];
        const isValid = await bcrypt.compare(password, user.admin_password);
        if (!isValid) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign({ admin_id: user.admin_id, email: user.admin_email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, role: user.role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const loginPOS = async (req, res) => {
    const { password } = req.body; 
    if (!password) return res.status(400).json({ error: 'Password required' });

    try {
        const { rows } = await pool.query('SELECT * FROM pos_users WHERE pos_id = 1');
        if (!rows.length) return res.status(400).json({ error: 'POS User not found' });

        const user = rows[0];
        const isValid = await bcrypt.compare(password, user.pos_password); 
        if (!isValid) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign({ pos_id: user.pos_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, role: user.role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    checkAdminExists,
    registerUser,
    loginUser,
    loginPOS
};