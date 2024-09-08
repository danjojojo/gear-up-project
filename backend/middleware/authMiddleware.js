const jwt = require('jsonwebtoken');
require('dotenv').config();  // Ensure dotenv is loaded here as well

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied, token missing!' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);  // Use JWT_SECRET from .env
        req.user = verified;
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid token' });
    }
};

module.exports = authenticateToken;