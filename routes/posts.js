// Post routes: list posts (GET /posts), create one (POST /posts), and edit or delete one (PUT/DELETE /posts/:id).
// Creating, editing and deleting need a logged-in user; editing and deleting only work on the user's own posts.
import express from "express";

import { getAllPosts, getPostById, createPost, deletePost, updatePost } from "../data/postQueries.js";
import { requireAuth } from "../middlewares/requireAuth.js";


 const router= express.Router();
 

    // requireAuth runs first, so this handler only runs for logged-in users. Category falls back to 'General'.
    router.post('/posts', requireAuth, (req, res)=>{
        console.log('POST /posts reached route');
        const title = req.body.title?.trim();
        const content = req.body.content?.trim();
        const category = req.body.category?.trim()|| 'General';

        if(!title || !content){
            return res.status(400).json({error: 'Title and content are required.'})
        }
        // The author is the logged-in user, taken from the session rather than the form.
        const id = createPost({
            title,
            content,
            category,
            authorId: req.session.userId,
        })
        res.status(200).json(getPostById(id))
    })

    // Returns all posts as JSON; ?category=... filters by category.
    router.get('/posts', (req,res)=>{
        const posts = getAllPosts(req.query.category)
        res.json(posts)
    });

    // Edits a post. 404 if it does not exist, 403 if the logged-in user is not its author.
    router.put('/posts/:id', requireAuth, (req,res)=>{
        const post = getPostById (Number(req.params.id));
        if (!post){
            return res.status(404).json({ error: 'Post not found!' })
        }
        if (post.authorId !== req.session.userId){
            return res.status(403).json({error : 'You can only edit your own posts'})
        }

        const title = req.body.title?.trim() ?? post.title; // ?? keeps the old value if the field is not sent at all
        const content = req.body.content?.trim() ?? post.content;
        const category = req.body.category?.trim() ?? post.category;

        if(!title || !content)
            return res.status(400).json({ error: 'Title and content can not be empty'});
    

        updatePost(post.id, {title, content, category});
        res.json(getPostById(post.id));
    });


    // Deletes a post, with the same 404/403 checks as editing. 204 means it worked and there is nothing to send back.
    router.delete('/posts/:id', requireAuth, (req, res)=>{
        const post = getPostById (Number(req.params.id));

        if(!post){
            return res.status(404).json({error: 'Post not found'})
        }
        if (post.authorId !== req.session.userId){
            return res.status(403).json({ error: 'You can only delete your own posts'})
        }
        deletePost(post.id);
        res.status(204).end();
    })

    router.get('/about', (req,res)=>{
        res.send("<h1>About</h1>")
    });

    export default router
