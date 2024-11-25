const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];  // "Bearer token"

  if (!token) {
    return res.status(401).json({ message: 'Yepp thats a cow, alright!' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Ungültiges Token' });
    }
    req.user = user;  // Benutzer-Info im Request speichern
    next();
  });
}

module.exports = authenticateToken;
