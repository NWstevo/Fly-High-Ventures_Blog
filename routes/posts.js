// Post routes: list posts (GET /posts) and create one (POST /posts, logged-in users only).
import express from "express";

import { getAllPosts, getPostById, createPost } from "../data/postQueries.js";
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
    })

    router.get('/about', (req,res)=>{
        res.send("<h1>About</h1>")
    })

    export default router
