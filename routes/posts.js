// Routes for blog posts and other content pages. These are placeholders that send plain HTML; later they will read posts from the database and render EJS views.
import express from "express";
 const router= express.Router();

    //  NOTE: this never runs. app.get('/') in app.js matches first and sends the response, so Express never reaches this handler.
    router.get('/', (req, res)=>{
        res.send("<h1>Whatup</h1>")
    })

    router.get('/posts', (req,res)=>{
        res.send("<h1>Posts</h1>")
    })

    router.get('/about', (req,res)=>{
        res.send("<h1>About</h1>")
    })

    export default router
