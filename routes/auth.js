// Authentication routes (sign up and log in). These are placeholders for now:
// They send fixed text instead of creating accounts or checking credentials.
import express from "express";

// A Router is a mini-app that holds a group of related routes. app.js mounts it with app.use(), which keeps app.js small as the project grows.
const router = express.Router();


router.get('/signup', (req, res)=>{
    res.send("Send users to signup auth")
})
router.get('/login', (req,res)=>{
    res.send("Existing User has to input their credentials")
})

router.post('/signup', (req, res)=>{
    res.send("Signup form submitted")
})
router.post('/login', (req,res)=>{
    res.send("Login form submitted")
})

export default router
