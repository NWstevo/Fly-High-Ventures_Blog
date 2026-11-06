import db from './database.js';

export function getAllPosts(category){
    if (category){
        return db.prepare('SELECT * FROM posts WHERE category = ? ORDER BY created_at DESC').all(category) //a named export that returns all posts in category if it exist
    }
    return db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all() //returns all posts if category is false
}