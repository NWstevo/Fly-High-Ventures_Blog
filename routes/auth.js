// Authentication routes (sign up and log in).
// POST /signup validates the form, creates the account, logs the user in and redirects home; GET /signup redirects home; the login routes still send placeholder text.
import express from "express";
import bycrypt from 'bcryptjs';

import {findUserByEmail, createUser} from '../data/userQueries.js'

// A Router is a mini-app that holds a group of related routes. app.js mounts it with app.use(), which keeps app.js small as the project grows.
const router = express.Router();


router.get('/login', (req, res)=>{
    res.send("Send users to login auth")
})
// Handles the sign-up form on the home page (views/index.ejs).
router.post('/signup', (req,res)=>{
    // Form fields arrive in req.body (parsed by express.urlencoded in app.js). Email is lowercased so the duplicate check ignores capitals.
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    // Validation: stop with an error message if the form data is not usable.
    if (!name || !email || !password){
        return res.status(400).send('Fill all required fields')
    }
    if (password.length < 8){
        return res.status(400).send('Password must be at least 8 characters')
    }
     if (findUserByEmail(email)) {
    return res.status(409).send('An account with this email already exists');
    }

    // createUser hashes the password and returns the new user's id.
    const userId = createUser({name, email, password});
    req.session.userId=userId
    res.redirect('/')
})

router.get('/signup', (req, res)=>{
    res.redirect('/')

})
router.post('/login', (req,res)=>{
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;
    if (!email || !password){
        return res.status(400).send('Email and Password are required')
    };

    const user = findUserByEmail(email);
    const passwordMatches = user && bycrypt.compareSync(password, user.password_hash);
    if (!passwordMatches){
        return res.status(401).send('Incorrect email or password!')
    }

    req.session.userId = user.id;

    res.redirect("/")
});

export default router
