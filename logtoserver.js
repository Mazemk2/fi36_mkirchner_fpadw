const express = require('express');
const bcrypt = require('bcryptjs');  // Für Passwort-Hashing
const session = require('express-session');  // Sitzungsverwaltung

const app = express();

// Middleware zum Parsen von POST-Anfragen
app.use(express.urlencoded({ extended: false }));

// Sitzungskonfiguration
app.use(session({
  secret: 'geheimesSchluessel', // Wähle einen sicheren Schlüssel
  resave: false,
  saveUninitialized: false
}));

// Einfache Benutzerdatenbank (wird hier im Speicher gehalten)
const users = [];

// **Startseite** hinzufügen
app.get('/', (req, res) => {
  res.send(`
    <h1>Willkommen zur App!</h1>
    <p><a href="/login">Login</a> | <a href="/register">Register</a></p>
  `);
});

// Anmeldeseite
app.get('/login', (req, res) => {
  res.send(`
    <h1>Login</h1>
    <form method="POST" action="/login">
      <label>Username:</label>
      <input type="text" name="username" required>
      <label>Password:</label>
      <input type="password" name="password" required>
      <button type="submit">Login</button>
    </form>
  `);
});

// Registrierungsseite
app.get('/register', (req, res) => {
  res.send(`
    <h1>Register</h1>
    <form method="POST" action="/register">
      <label>Username:</label>
      <input type="text" name="username" required>
      <label>Password:</label>
      <input type="password" name="password" required>
      <button type="submit">Register</button>
    </form>
  `);
});

// Registrierung eines neuen Benutzers
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.send('Benutzername bereits vergeben.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.send('Registrierung erfolgreich. <a href="/login">Jetzt anmelden</a>');
});

// Benutzeranmeldung
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username);
  
  if (!user) {
    return res.send('Benutzername nicht gefunden.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.send('Falsches Passwort.');
  }

  req.session.userId = user.username;
  res.send('Login erfolgreich! <a href="/protected">Gehe zu geschützten Bereich</a>');
});

// Geschützte Seite (nur für angemeldete Benutzer)
app.get('/protected', (req, res) => {
  if (!req.session.userId) {
    return res.send('Bitte zuerst einloggen. <a href="/login">Login</a>');
  }

  res.send(`Willkommen im geschützten Bereich, ${req.session.userId}!`);
});

// Abmelden
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.send('Fehler beim Abmelden');
    }
    res.send('Abgemeldet. <a href="/login">Login</a>');
  });
});

// Server starten
app.listen(3000, () => {
  console.log('Server läuft auf http://localhost:3000');
});
