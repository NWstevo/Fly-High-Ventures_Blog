
import express from "express";
import { getAllPosts } from "../data/postQueries.js";


 const router= express.Router();

    //  NOTE: this never runs. app.get('/') in app.js matches first and sends the response, so Express never reaches this handler.
    router.get('/', (req, res)=>{
        res.send("<h1>Whatup</h1>")
    })

    router.get('/posts', (req,res)=>{
        const posts = getAllPosts(req.query.category)
        res.json(posts)
    })

    router.get('/about', (req,res)=>{
        res.send("<h1>About</h1>")
    })

    export default router
