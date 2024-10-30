const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

const accessTokenRefresh = '1h';
const refreshTokenRefresh = '7d';

const checkAdminExists = async (req, res) => {
    try {
      const { rowCount } = await pool.query('SELECT * FROM admin');
      res.json({ exists: rowCount > 0 });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

const checkPosExists = async (req, res) => {
    try {
        const { rows } = await pool.query(
          "SELECT * FROM pos_users WHERE pos_status = 'active' ORDER BY pos_id ASC"
        );
        const exists = rows.length > 0
        res.json({ exists, users: rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const registerUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin_id = uuidv4()
        const admin_name = 'Admin'
        const { rows } = await pool.query('INSERT INTO admin (admin_id, admin_name, admin_email, admin_password) VALUES ($1, $2, $3, $4) RETURNING *', [admin_id, admin_name, email, hashedPassword]);
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

        const token = jwt.sign({ admin_id: user.admin_id, email: user.admin_email, name: user.admin_name, role: user.role }, process.env.JWT_SECRET, { expiresIn: accessTokenRefresh });

        // Create refresh token (long-lived)
        const refreshToken = jwt.sign(
            { admin_id: user.admin_id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: refreshTokenRefresh } // Refresh token expires in 7 days
        );

        // Store refresh token in HttpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.cookie('token', token, {
          httpOnly: true, // httpOnly ensures JavaScript can't access this cookie
          secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS only)
          sameSite: 'Strict', // Protect against CSRF
          maxAge: 3600000, // 1 hour expiration
        });

        res.cookie('role', user.role, {
          httpOnly: true, // httpOnly ensures JavaScript can't access this cookie
          secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS only)
          sameSite: 'Strict', // Protect against CSRF
          maxAge: 3600000, // 1 hour expiration
        });

        res.json({ role: user.role, message: 'Login successful' });
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message });
    }
};

const loginPOS = async (req, res) => {
    const { id, password } = req.body; 
    if (!password) return res.status(400).json({ error: 'Password required' });

    try {
      const { rows } = await pool.query(
        "SELECT * FROM pos_users WHERE pos_id = $1 AND pos_status = 'active'",
        [id]
      );
      if (!rows.length)
        return res.status(400).json({ error: "POS User not found" });

      const user = rows[0];
      const isValid = await bcrypt.compare(password, user.pos_password);
      if (!isValid) return res.status(400).json({ error: "Invalid password" });

      const token = jwt.sign(
        { pos_id: user.pos_id, name: user.pos_name, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: accessTokenRefresh }
      );

      // Create refresh token (long-lived)
      const refreshToken = jwt.sign(
          { pos_id: user.pos_id },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: refreshTokenRefresh } // Refresh token expires in 7 days
      );

      // Store refresh token in HttpOnly cookie
      res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.cookie('token', token, {
        httpOnly: true, // httpOnly ensures JavaScript can't access this cookie
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS only)
        sameSite: 'Strict', // Protect against CSRF
        maxAge: 3600000, // 1 hour expiration
      });

      res.cookie('role', user.role, {
        httpOnly: true, // httpOnly ensures JavaScript can't access this cookie
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS only)
        sameSite: 'Strict', // Protect against CSRF
        maxAge: 3600000, // 1 hour expiration
      });

      res.json({ role: user.role, message: 'Login successful' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

const getMyRole = async (req, res) => {
    res.json({ role: req.cookies.role });
}

const getMyName = async (req, res) => {
    try {
      const role = req.cookies.role;
      if(role === 'staff'){
        const { rows } = await pool.query(
          "SELECT pos_name FROM pos_users WHERE pos_id = $1",
          [req.user.pos_id]
        );
        res.json({ name: rows[0].pos_name });
      } else if(role === 'admin'){
        const { rows } = await pool.query(
          "SELECT admin_name FROM admin WHERE admin_id = $1",
          [req.user.admin_id]
        );
        res.json({ name: rows[0].admin_name });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

const logoutUser = (req, res) => {
  // Clear the token and any other relevant cookies
  res.clearCookie('token', { httpOnly: true, sameSite: 'Strict', secure: process.env.NODE_ENV === 'production' });
  res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'Strict', secure: process.env.NODE_ENV === 'production' });
  res.clearCookie('role');  // If you're storing the role in a separate cookie
  res.status(200).json({ message: 'Logged out successfully' });
};

const refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ error: 'Refresh Token required' });

    try {
        console.log(req.cookies.role);
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Create a new access token
        const accessToken = jwt.sign(
            { pos_id: decoded.pos_id, role: decoded.role },
            process.env.JWT_SECRET,
            { expiresIn: accessTokenRefresh }
        );

        // Return the new access token
        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 3600000 // 1 hour expiration
        });

        res.json({ message: 'Access token refreshed'});
    } catch (err) {
        res.status(403).json({ error: err.message });
    }
};

module.exports = {
    checkAdminExists,
    checkPosExists,
    registerUser,
    loginUser,
    loginPOS,
    getMyRole,
    getMyName,
    logoutUser,
    refreshToken
};