const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Get the token from the cookies
  const token = req.cookies.token;

  // Check if the token is present
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized. No token provided.' });
  }

  try {
    // Verify the token and attach the user to the request object
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    console.log('Verified token');
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    
    res.clearCookie('token', {
      httpOnly: true, 
      sameSite: 'Strict',
      secure: process.env.NODE_ENV === 'production',
    });

    res.clearCookie('role', {
      httpOnly: true, 
      sameSite: 'Strict',
      secure: process.env.NODE_ENV === 'production',
    });
    
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;
