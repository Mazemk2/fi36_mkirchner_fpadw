// db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost', // MariaDB-Host
    user: 'root', // Benutzername der Datenbank
    password: 'Root', // Datenbank-Passwort
    database: 'noch zu benennen'
});

module.exports = pool.promise();