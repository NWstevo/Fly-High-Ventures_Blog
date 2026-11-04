import express from "express";

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