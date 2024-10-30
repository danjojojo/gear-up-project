// Middleware to check if the user's role is among the allowed roles
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    const role = req.cookies.role; 

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
    }

    console.log("Role is correct");
    next();  // Proceed to the next middleware or route handler if role matches
  };
};

module.exports = checkRole;