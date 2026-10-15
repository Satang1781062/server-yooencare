const { verify } = require('../utils/jwt');

module.exports = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    req.user = verify(token);
    next();
  } catch (e) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
