// Database queries for the users table, used by routes/auth.js.
import bcrypt from 'bcryptjs';
import db from './database.js';

export function findUserByEmail(email){
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email) //returns the user with this email, or undefined if there is none
}

export function createUser({name, email, password}){
    const passwordHash=bcrypt.hashSync(password) //only the hash is stored, never the plain password (default 10 rounds)
    const result = db.prepare(`
        INSERT INTO users(name, email, password_hash)
        VALUES(?, ?, ?)`).run(name, email, passwordHash)
    return result.lastInsertRowid //the id SQLite gave the new user
}