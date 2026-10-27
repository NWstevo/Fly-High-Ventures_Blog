import express from "express";
 const router= express.Router();

    router.get('/', (req, res)=>{
        res.send("<h1>Whatup</h1>")
    })

    router.get('/posts', (req,res)=>{
        res.send("<h1>Posts</h1>")
    })
    
    router.get('/about', (req,res)=>{