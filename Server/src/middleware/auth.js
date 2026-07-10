const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access denied. No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // In your auth.js you used decoded.id, in authenticate.js decoded.userId
    // Choose the correct key depending on how you sign your tokens
    const userId = decoded.id || decoded.userId;

    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    req.user = user; // attach user doc to request
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticateToken;
