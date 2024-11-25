const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];  // Authorization-Header holen
  const token = authHeader && authHeader.split(' ')[1];  // Bearer <Token>

  if (!token) {
    return res.status(401).json({ message: 'Token fehlt' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Ungültiges Token' });
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;


