const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const accessTokenRefresh = '1h';
const refreshTokenRefresh = '7d';

const checkAdminExists = async (req, res) => {
  try {
    const { rowCount } = await pool.query('SELECT * FROM admin WHERE admin_2fa_enabled = true');
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
    const admin_id = uuidv4();
    const admin_name = 'Admin';
    const secret = speakeasy.generateSecret({ name: `GearUp Admin (${email})` });

    const { rows } = await pool.query('INSERT INTO admin (admin_id, admin_name, admin_email, admin_password, admin_2fa_secret) VALUES ($1, $2, $3, $4, $5) RETURNING *', [admin_id, admin_name, email, hashedPassword, secret.base32]);

    const token = jwt.sign({ admin_id: admin_id }, process.env.JWT_SECRET, { expiresIn: accessTokenRefresh });
    res.cookie('token', token, {
      httpOnly: true, // httpOnly ensures JavaScript can't access this cookie
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS only)
      sameSite: 'Strict', // Protect against CSRF
      maxAge: 3600000, // 1 hour expiration
    });

    const qrCodeDataURL = await qrcode.toDataURL(secret.otpauth_url);

    res.status(201).json({ admin: rows[0], qrCodeDataURL});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// const loginUser = async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

//   try {
//     const { rows } = await pool.query('SELECT * FROM admin WHERE admin_email = $1', [email]);
//     if (!rows.length) return res.status(400).json({ error: 'User not found' });

//     const user = rows[0];
//     const isValid = await bcrypt.compare(password, user.admin_password);
//     if (!isValid) return res.status(400).json({ error: 'Invalid password' });

//     return res.status(200).json({ otpRequired: true });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to log in' });
//   }
// };


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

    const logId = await logUserLogin(user.pos_id, user.pos_name);

    const token = jwt.sign(
      { pos_id: user.pos_id, name: user.pos_name, role: user.role, logId },
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
    if (role === 'staff') {
      const { rows } = await pool.query(
        "SELECT pos_name FROM pos_users WHERE pos_id = $1",
        [req.user.pos_id]
      );
      res.json({ name: rows[0].pos_name });
    } else if (role === 'admin') {
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
  // Decode the token to get the logId
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const logId = decoded.logId;

      // Record the logout time in the database
      logUserLogout(logId);
    } catch (err) {
      console.error("Failed to decode token:", err);
    }
  }

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
        if(role === 'admin'){
            const accessToken = jwt.sign(
                { admin_id: decoded.admin_id, role: decoded.role },
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
        } else {
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
        }

    res.json({ message: 'Access token refreshed' });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

// Logs the user's login and returns the log_id for this session
const logUserLogin = async (pos_id, pos_name) => {
  const query = `
      INSERT INTO pos_logs (pos_id, pos_name, login_time) 
      VALUES ($1, $2, NOW()) 
      RETURNING log_id;
  `;
  const values = [pos_id, pos_name];
  const { rows } = await pool.query(query, values);
  return rows[0].log_id;
};

// Updates the logout time in the logs for the specific log_id
const logUserLogout = async (log_id) => {
  const query = `
      UPDATE pos_logs 
      SET logout_time = NOW() 
      WHERE log_id = $1;
  `;
  const values = [log_id];
  await pool.query(query, values);
};

const verifyOTP = async (req, res) => {
    const { otp } = req.body;
    console.log(otp, req.user);
    const adminId = req.user.admin_id;  // Get the admin's ID from the auth context or JWT

    try {
        const { rows } = await pool.query('SELECT admin_2fa_secret FROM admin WHERE admin_id = $1', [adminId]);
        const admin = rows[0];
        
        if (!admin || !admin.admin_2fa_secret) {
            return res.status(400).json({ error: '2FA not set up for this user.' });
        }

        const verified = speakeasy.totp.verify({
            secret: admin.admin_2fa_secret,
            encoding: 'base32',
            token: otp,
        });

        if (verified) {
            res.clearCookie('token', { httpOnly: true, sameSite: 'Strict', secure: process.env.NODE_ENV === 'production' });
            await pool.query('UPDATE admin SET admin_2fa_enabled = true WHERE admin_id = $1', [adminId]);
            res.status(200).json({ message: 'OTP verified successfully' });
        } else {
            res.status(401).json({ error: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error.message);
        res.status(500).json({ error: 'Failed to verify OTP' });
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
    res.cookie('token', token, { httpOnly: true, sameSite: 'Strict'});
    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to log in' });
  }
};

const verifyAdminOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' });

  try {
      const { rows } = await pool.query('SELECT * FROM admin WHERE admin_email = $1', [email]);
      if (!rows.length) return res.status(400).json({ error: 'User not found' });

      const user = rows[0];

      const verified = speakeasy.totp.verify({
        secret: user.admin_2fa_secret,
        encoding: 'base32',
        token: otp,
      });

      if (verified) {
      // Generate JWT token upon successful OTP verification
        const token = jwt.sign({ admin_id: user.admin_id, email: user.admin_email, name: user.admin_name, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const refreshToken = jwt.sign(
          { admin_id: user.admin_id },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: '7d' }
        );

        // Set tokens in cookies
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict',
        });

        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict',
        });

        res.cookie('role', user.role, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict',
          maxAge: 3600000
        });

          res.status(200).json({ message: 'OTP verified' });
        } else {
          res.status(401).json({ error: 'Invalid OTP' });
        }

   } catch (error) {
      console.error('Error verifying OTP:', error.message);
      res.status(500).json({ error: 'Failed to verify OTP' });
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
  refreshToken,
  verifyOTP,
  verifyAdminOTP
};