const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('./db');
const authRoutes = require('./routes/auth');
const authenticate = require('./middleware/authenticate');
require('dotenv').config();  // Lade Umgebungsvariablen

const app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('public'));

// **Öffentliche Route für Login-Seite**
app.get('/login', (req, res) => {
  res.render('login');  // Login-Seite anzeigen, keine Authentifizierung erforderlich
});

// **Auth-Routen für Login und Logout**
app.use('/auth', authRoutes);

// **Geschützte Route für das Dashboard**
app.get('/dashboard', authenticate, (req, res) => {
  res.send('Willkommen im geschützten Bereich!');
});

// **Onepager (Daten anzeigen) - Geschützt**
app.get('/', authenticate, (req, res) => {
  const queries = {
    mitarbeiter: 'SELECT * FROM Mitarbeiter',
    produkte: 'SELECT * FROM Produkt',
    bestellungen: `SELECT b.bestellung_id, m.name AS mitarbeiter_name, b.datum, 
                          p.titel, bp.menge, bp.einzelpreis
                   FROM Bestellung b
                   JOIN Mitarbeiter m ON b.mitarbeiter_id = m.mitarbeiter_id
                   JOIN Bestellung_Produkt bp ON b.bestellung_id = bp.bestellung_id
                   JOIN Produkt p ON bp.produkt_id = p.produkt_id`
  };

  Promise.all([
    db.query(queries.mitarbeiter),
    db.query(queries.produkte),
    db.query(queries.bestellungen)
  ]).then(([mitarbeiter, produkte, bestellungen]) => {
    res.render('onepager', {
      mitarbeiter: mitarbeiter[0],
      produkte: produkte[0],
      bestellungen: bestellungen[0]
    });
  }).catch(err => {
    res.status(500).send('Fehler beim Abrufen der Daten');
    console.error(err);
  });
});

// Server starten
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
