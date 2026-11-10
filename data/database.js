/* Opens the SQLite database and creates the tables if they do not exist yet.
better-sqlite3 is synchronous: queries return results directly.
It is run directly (node data/database.js) or once a route imports `db`.*/
import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

// ES modules have no built-in __dirname, so we build it from this file's URL.
const __dirname = path.dirname(fileURLToPath(import.meta.url));


// Opens blog.db file, or creates an empty one if it does not exist.
const db = new Database(path.join(__dirname, 'blog.db'));


//  SQLite does not enforce FOREIGN KEY constraints unless this is turned on and the setting has to be applied on every new connection.
db.pragma("foreign_keys = ON");


// calling a method on the database object named db. It sends the SQL inside the template string to the database to execute.
db.exec(`
    CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')));


    CREATE TABLE IF NOT EXISTS posts(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    authorId INTEGER NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT);

    `);

// - updatedAt is NULL until the post is edited for the first time.
export default db;