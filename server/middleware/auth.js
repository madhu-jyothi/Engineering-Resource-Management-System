const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate JWT and attach user to req
async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Middleware to allow only managers
function requireManager(req, res, next) {
  if (req.user && req.user.role === 'manager') return next();
  return res.status(403).json({ message: 'Manager access required' });
}

module.exports = { authenticate, requireManager };
