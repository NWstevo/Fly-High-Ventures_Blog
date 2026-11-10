// Database queries for the posts table, used by routes/posts.js.
import db from './database.js';

export function getAllPosts(category){
    if (category){
        return db.prepare('SELECT * FROM posts WHERE category = ? ORDER BY created_at DESC').all(category) //a named export that returns all posts in category if it exist
    }
    return db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all() //returns all posts if category is false
}

export function getPostById(id) {
  return db.prepare('SELECT * FROM posts WHERE id = ?').get(id); //returns one post, or undefined if there is none
}

export function createPost({title, content, category, authorId}){
    const result =
        db.prepare('INSERT INTO posts(title, content, category, author_Id) VALUES (?, ?, ?, ?)' )
        .run(title, content, category, authorId)
    return result.lastInsertRowid; //the id SQLite gave the new post
}

