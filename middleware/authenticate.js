const jwt = require('jsonwebtoken');
const JWT_SECRET = 'dein_secret_key';

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) return res.status(401).json({ message: 'Token fehlt' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token ist ungültig' });

        req.user = user; // Benutzerinformationen zur Anfrage hinzufügen
        next();
    });
}

module.exports = authenticateToken;
