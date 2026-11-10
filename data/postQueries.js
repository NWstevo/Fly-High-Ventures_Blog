// Database queries for the posts table, used by routes/posts.js.
import db from './database.js';

export function getAllPosts(category){
    if (category){
        return db.prepare('SELECT * FROM posts WHERE category = ? ORDER BY createdAt DESC').all(category) //a named export that returns all posts in category if it exist
    }
    return db.prepare('SELECT * FROM posts ORDER BY createdAt DESC').all() //returns all posts if category is false
}

export function getPostById(id) {
  return db.prepare('SELECT * FROM posts WHERE id = ?').get(id); //returns one post, or undefined if there is none
}

export function createPost({title, content, category, authorId}){
    const result =
        db.prepare('INSERT INTO posts(title, content, category, authorId) VALUES (?, ?, ?, ?)' )
        .run(title, content, category, authorId)
    return result.lastInsertRowid; //the id SQLite gave the new post
}

export function updatePost(id, { title, content, category}){
    return db.prepare(`UPDATE posts SET title= ?, content = ?, category= ?, updatedAt= datetime('now')
        WHERE id = ?`).run(title, content, category, id); //also sets updatedAt to the current time (UTC)
}

export function deletePost(id){
    return db.prepare(`DELETE FROM posts WHERE id = ?`).run(id); //removes the post for good
}