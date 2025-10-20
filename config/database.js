const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.sqlite');

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error connecting to database', err);
    } else {
        console.log('Connected to the database');
    }
});

db.serialize(() => {
    db.run(
        `CREATE TABLE IF NOT EXISTS Forms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            surname TEXT NOT NULL,
            occupation INTEGER NOT NULL,
            college TEXT NOT NULL,
            dateOfBirth INTEGER NOT NULL,
            yearOfConclusion INTEGER NOT NULL,
            email TEXT NOT NULL,
            primaryPhone TEXT NOT NULL,
            secondaryPhone TEXT,
            resume BLOB
        )`
    );
});

module.exports = db;