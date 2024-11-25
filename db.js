const mysql = require('mysql2/promise');  // Verwende 'promise'-Version von mysql2
require('dotenv').config(); // Lade Umgebungsvariablen

const db = mysql.createPool({
  host: process.env.DB_HOST,  // DB_HOST aus der .env-Datei
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db;  // Exportiere das Pool-Objekt
