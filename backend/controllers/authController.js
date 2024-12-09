const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

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

    const token = jwt.sign({ admin_id: admin_id }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m' });
    res.cookie('token', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict', 
      maxAge: 3600000,
    });

    const qrCodeDataURL = await qrcode.toDataURL(secret.otpauth_url);

    res.status(201).json({ admin: rows[0], qrCodeDataURL});
  } catch (err) {
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

    const logId = await logUserLogin(user.pos_id, user.pos_name);

    const token = jwt.sign(
      { pos_id: user.pos_id, name: user.pos_name, role: user.role, logId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m' }
    );

    const refreshToken = jwt.sign(
      { pos_id: user.pos_id, role: user.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d' } 
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite:  process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
    });

    res.cookie('role', user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
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
    res.status(500).json({ error: "Error" });
  }
}

const logoutUser = (req, res) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const logId = decoded.logId;

      logUserLogout(logId);
    } catch (err) {
      console.log("Failed to decode token");
    }
  }

  res.clearCookie('token', { httpOnly: true, sameSite:  process.env.NODE_ENV === 'production' ? 'None' : 'Strict', secure: process.env.NODE_ENV === 'production' });
  res.clearCookie('refreshToken', { httpOnly: true, sameSite:  process.env.NODE_ENV === 'production' ? 'None' : 'Strict', secure: process.env.NODE_ENV === 'production' });
  res.clearCookie('role');
  res.status(200).json({ message: 'Logged out successfully' });
};

const refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh Token required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const { role } = decoded;

    let accessToken;

    if (role === 'admin') {
      accessToken = jwt.sign(
        { admin_id: decoded.admin_id, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m' }
      );
    } else {
      accessToken = jwt.sign(
        { pos_id: decoded.pos_id, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m' }
      );
    }

    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
    });

    res.json({ message: 'Access token refreshed' });
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired refresh token.' });
  }
};


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
    const adminId = req.user.admin_id;

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
            res.clearCookie('token', { httpOnly: true, sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict', secure: process.env.NODE_ENV === 'production' });
            await pool.query('UPDATE admin SET admin_2fa_enabled = true WHERE admin_id = $1', [adminId]);
            res.status(200).json({ message: 'OTP verified successfully' });
        } else {
            res.status(401).json({ error: 'Invalid OTP' });
        }
    } catch (error) {
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
    const token = jwt.sign({ admin_id: user.admin_id, email: user.admin_email, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m' });
    res.cookie('token', token, { httpOnly: true, sameSite:  process.env.NODE_ENV === 'production' ? 'None' : 'Strict'});
    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
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
        const token = jwt.sign({ admin_id: user.admin_id, email: user.admin_email, name: user.admin_name, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m' });

        const refreshToken = jwt.sign(
          { admin_id: user.admin_id, role: user.role },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d' }
        );

        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite:  process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
        });

        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite:  process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
        });

        res.cookie('role', user.role, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite:  process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
        });

          res.status(200).json({ message: 'OTP verified' });
        } else {
          res.status(401).json({ error: 'Invalid OTP' });
        }

   } catch (error) {
      res.status(500).json({ error: 'Failed to verify OTP' });
   }
};

const forgotPassword = async (req, res) => {
  const {email} = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM admin WHERE admin_email = $1', [email]);
    if (!rows.length) return res.status(400).json({ error: 'User not found' });

    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(token, 10);
    const expiration = new Date(Date.now() + 3600000).toLocaleString("en-US", { timeZone: "Asia/Manila" });

    await pool.query('INSERT INTO password_reset_tokens (email, token, expires_at) VALUES ($1, $2, $3)', [email, hashedToken, expiration]);

    const resetLink = `${process.env.ADMIN_URL}/reset-password?token=${token}&email=${email}`;
    await sendEmail(email, resetLink);

    res.status(200).json({ message: 'Password reset link sent' });
  } catch (error) {
    res.status(500).json({ error: "Error" });
  }
}

const sendEmail = async (email, link) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { 
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS 
    },
    tls: {
        rejectUnauthorized: false
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    html: `<p>Click <a href="${link}">here</a> to reset your password.</p>`
  });
};

const resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;

  try {
    const { rows } = await pool.query('SELECT * FROM password_reset_tokens WHERE email = $1 AND expires_at > NOW()', [email]);
    if (!rows.length || !(await bcrypt.compare(token, rows[0].token))) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE admin SET admin_password = $1 WHERE admin_email = $2', [hashedPassword, email]);

    await pool.query('DELETE FROM password_reset_tokens WHERE email = $1', [email]);
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};

const changePassword = async (req, res) => {
  const { newPassword } = req.body;

  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const adminEmail = decoded.email;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE admin SET admin_password = $1 WHERE admin_email = $2', [hashedPassword, adminEmail]);

    res.status(200).json({ message: 'Password change successful' });
  } catch (error) {
    res.status(500).json({ message: "Error" });
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
  verifyAdminOTP,
  forgotPassword,
  resetPassword,
  changePassword
};