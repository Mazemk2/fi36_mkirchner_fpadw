const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('.         
    
    ./db'); // Datenbankverbindung importieren
const router = express.Router();

const JWT_SECRET = 'dein_secret_key'; // Setze hier einen sicheren Schlüssel

// Registrierung
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    // Email-Validierung (z.B. @firma.com)
    if (!email.endsWith('@firma.com')) {
        return res.status(400).json({ message: 'Nur firmeneigene E-Mail-Adressen sind erlaubt.' });
    }

    // Passwortanforderungen prüfen
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@$%?]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: 'Passwort muss mindestens 8 Zeichen, einen Großbuchstaben, eine Zahl und ein Sonderzeichen enthalten.' });
    }

    try {
        // Passwort hashen
        const hashedPassword = await bcrypt.hash(password, 10);

        // Benutzer speichern
        await db.execute('INSERT INTO users (email, password_hash) VALUES (?, ?)', [email, hashedPassword]);
        res.status(201).json({ message: 'Registrierung erfolgreich!' });
    } catch (error) {
        res.status(500).json({ message: 'Fehler bei der Registrierung', error });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Benutzer mit passender E-Mail finden
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Ungültige E-Mail oder Passwort.' });
        }

        // Passwort prüfen
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Ungültige E-Mail oder Passwort.' });
        }

        // JWT erstellen
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login erfolgreich!', token });
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Login', error });
    }
});

module.exports = router;
