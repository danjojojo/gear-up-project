const jwt = require('jsonwebtoken');
const { refreshToken } = require('../controllers/authController');

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  const retrievedRefreshToken = req.cookies.refreshToken;

  if (!token && !retrievedRefreshToken) {
    return res.status(401).json({ message: 'Unauthorized. Tokens are missing.' });
  }

  try {
    // Verify the access token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // Try refreshing the token using the refresh token
      try {
        const decodedRefresh = jwt.verify(retrievedRefreshToken, process.env.JWT_REFRESH_SECRET);
        req.user = decodedRefresh; // Attach decoded refresh token payload to the request
        return refreshToken(req, res); // Refresh the token

      } catch (refreshError) {
        
        // Clear tokens and send error response
        res.clearCookie('token', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
        });
        res.clearCookie('refreshToken', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
        });
        return res.status(403).json({ message: 'Refresh token invalid or expired.' });
      }
    } else {
      
      // Clear tokens and send error response
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
      });
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
      });
      return res.status(403).json({ message: 'Invalid token.' });
    }
  }
};

module.exports = verifyToken;
