// app.js
const express = require('express');
const authRoutes = require('./routes/auth'); // Authentifizierungsrouten
const authenticate = require('./middleware/authenticate'); // JWT-Middleware
const app = express();

app.use(express.json()); // Middleware zum Parsen von JSON-Daten

// Authentifizierungsrouten
app.use('/auth', authRoutes);

// Beispiel für eine geschützte Route
app.get('/protected', authenticate, (req, res) => {
    res.json({ message: 'Willkommen in der geschützten Route!', user: req.user });
});

// Server starten
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
