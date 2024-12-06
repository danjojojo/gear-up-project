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
    console.log('Verified token');
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.log('Access token expired.');

      // Try refreshing the token using the refresh token
      try {
        const decodedRefresh = jwt.verify(retrievedRefreshToken, process.env.JWT_REFRESH_SECRET);
        req.user = decodedRefresh; // Attach decoded refresh token payload to the request

        console.log('Refreshing access token...');
        return refreshToken(req, res); // Refresh the token
      } catch (refreshError) {
        console.error('Error verifying refresh token:', refreshError.message);

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
      console.error('Invalid token:', error.message);

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
