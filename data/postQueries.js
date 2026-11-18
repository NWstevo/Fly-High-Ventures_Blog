// Database queries for the posts table, used by routes/posts.js.
import db from './database.js';

// Every post plus its author's name (as authorName), taken from the users table.
// Only users.name is selected, never users.*, so the password hash is never read here.
// Both tables have id and createdAt, so the column names are prefixed with posts.
const POSTS_WITH_AUTHOR = `SELECT posts.*, users.name AS authorName FROM posts JOIN users ON users.id = posts.authorId`;

export function getAllPosts(category){
    if (category){
        return db.prepare(`${POSTS_WITH_AUTHOR} WHERE posts.category = ? ORDER BY posts.createdAt DESC`).all(category) //all posts in that category, newest first
    }
    return db.prepare(`${POSTS_WITH_AUTHOR} ORDER BY posts.createdAt DESC`).all() //all posts when no category is given
}

export function getPostById(id) {
  return db.prepare(`${POSTS_WITH_AUTHOR} WHERE posts.id = ?`).get(id); //one post with its author's name, or undefined if there is none
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

export function getPostsByAuthor(authorId) {
  return db
    .prepare('SELECT * FROM posts WHERE authorId = ? ORDER BY createdAt DESC')
    .all(authorId);
}