const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    console.log('Verified token');
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // Token has expired; clear only the access token cookie
      console.log(error);
      res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'Strict',
        secure: process.env.NODE_ENV === 'production',
      });

      return res.status(401).json({ message: 'Access token expired. Please use the refresh token to obtain a new access token.' });
    } else {
      // For other token errors, clear both cookies and send a 403 status
      res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'Strict',
        secure: process.env.NODE_ENV === 'production',
      });
      res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'Strict',
        secure: process.env.NODE_ENV === 'production',
      });

      return res.status(403).json({ message: 'Invalid token.' });
    }
  }
};

module.exports = verifyToken;
