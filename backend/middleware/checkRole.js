// Middleware to check the user's role
const checkRole = (requiredRole) => {
  return (req, res, next) => {
    const { role } = req.user; 

    if (role !== requiredRole) {
      return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
    }

    console.log("Role is correct");
    next();  // Proceed to the next middleware or route handler if role matches
  };
};

module.exports = checkRole;