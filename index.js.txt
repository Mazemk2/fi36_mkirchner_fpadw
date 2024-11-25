const express = require('express');
const mysql = require('mysql2');
const app = express();

// EJS als Template Engine einrichten
app.set('view engine', 'ejs');

// Statische Dateien bereitstellen
app.use(express.static('public'));

// Verbindung zur Datenbank
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',     // DB-Benutzername hier
  password: 'Root',      // DB-Passwort hier
  database: 'needsname'     // DB-Name hier
});

// Route für den Onepager
app.get('/', (req, res) => {
  const queries = {
    mitarbeiter: 'SELECT * FROM Mitarbeiter',
    produkte: 'SELECT * FROM Produkt',
    bestellungen: `
      SELECT b.bestellung_id, m.name AS mitarbeiter_name, b.datum, 
             p.titel, bp.menge, bp.einzelpreis
      FROM Bestellung b
      JOIN Mitarbeiter m ON b.mitarbeiter_id = m.mitarbeiter_id
      JOIN Bestellung_Produkt bp ON b.bestellung_id = bp.bestellung_id
      JOIN Produkt p ON bp.produkt_id = p.produkt_id
    `
  };

  // Alle Datenbankabfragen parallel ausführen
  Promise.all([
    db.promise().query(queries.mitarbeiter),
    db.promise().query(queries.produkte),
    db.promise().query(queries.bestellungen)
  ]).then(([mitarbeiter, produkte, bestellungen]) => {
    res.render('onepager', {
      mitarbeiter: mitarbeiter[0],
      produkte: produkte[0],
      bestellungen: bestellungen[0]
    });
  }).catch(err => {
    res.send('Fehler beim Abrufen der Daten');
    console.error(err);
  });
});

// Server starten
app.listen(3000, () => {
  console.log('Server läuft auf http://localhost:3000');
});
