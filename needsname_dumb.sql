-- Tabelle: Mitarbeiter
CREATE TABLE Mitarbeiter (
  mitarbeiter_id INTEGER PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  abteilung VARCHAR(50)
);

-- Tabelle: Produkt
CREATE TABLE Produkt (
  produkt_id INTEGER PRIMARY KEY AUTO_INCREMENT,
  titel VARCHAR(100) NOT NULL,
  beschreibung TEXT,
  preis DECIMAL(10, 2) NOT NULL,
  bestand INTEGER NOT NULL DEFAULT 0,
  bild VARCHAR(255)
);

-- Tabelle: Bestellung
CREATE TABLE Bestellung (
  bestellung_id INTEGER PRIMARY KEY AUTO_INCREMENT,
  mitarbeiter_id INTEGER NOT NULL,
  datum DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mitarbeiter_id) REFERENCES Mitarbeiter(mitarbeiter_id)
);

-- Zwischentabelle: Bestellung_Produkt
CREATE TABLE Bestellung_Produkt (
  bestellung_produkt_id INTEGER PRIMARY KEY AUTO_INCREMENT,
  bestellung_id INTEGER NOT NULL,
  produkt_id INTEGER NOT NULL,
  menge INTEGER NOT NULL,
  einzelpreis DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (bestellung_id) REFERENCES Bestellung(bestellung_id),
  FOREIGN KEY (produkt_id) REFERENCES Produkt(produkt_id)
);

-- Tabelle: Rechnung
CREATE TABLE Rechnung (
  rechnung_id INTEGER PRIMARY KEY AUTO_INCREMENT,
  bestellung_id INTEGER NOT NULL,
  datum DATETIME DEFAULT CURRENT_TIMESTAMP,
  gesamtpreis DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (bestellung_id) REFERENCES Bestellung(bestellung_id)
);

-- Beispiel-Daten für Mitarbeiter
INSERT INTO Mitarbeiter (name, abteilung) VALUES 
('Max Mustermann', 'Vertrieb'),
('Anna Meier', 'Marketing'),
('Lisa Schmidt', 'IT'),
('Tom Becker', 'Einkauf');

-- Beispiel-Daten für Produkte
INSERT INTO Produkt (titel, beschreibung, preis, bestand, bild) VALUES
('Bürostuhl', 'Ergonomischer Stuhl mit Lendenstütze', 149.00, 20, '/bilder/stuhl.jpg'),
('Laptop', '15-Zoll Laptop mit 16GB RAM', 999.99, 10, '/bilder/laptop.jpg'),
('Monitor', '24-Zoll Monitor Full HD', 199.99, 15, '/bilder/monitor.jpg'),
('Tastatur', 'Mechanische Tastatur mit RGB', 89.99, 50, '/bilder/tastatur.jpg');

-- Beispiel-Daten für Bestellungen
INSERT INTO Bestellung (mitarbeiter_id, datum) VALUES 
(1, '2024-11-13 10:30:00'),
(2, '2024-11-13 14:15:00');

-- Beispiel-Daten für Bestellung_Produkt (Positionen in den Bestellungen)
INSERT INTO Bestellung_Produkt (bestellung_id, produkt_id, menge, einzelpreis) VALUES
(1, 1, 1, 149.00),  -- Bestellung 1: 1x Bürostuhl
(1, 3, 2, 199.99),  -- Bestellung 1: 2x Monitor
(2, 2, 1, 999.99),  -- Bestellung 2: 1x Laptop
(2, 4, 1, 89.99);   -- Bestellung 2: 1x Tastatur

