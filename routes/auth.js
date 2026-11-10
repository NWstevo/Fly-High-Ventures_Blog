// Authentication routes (sign up, log in and log out).
// The sign-up and login forms live on the home page, so GET /signup and GET /login just redirect there.
import express from "express";
import bcrypt from 'bcryptjs';

import {findUserByEmail, createUser} from '../data/userQueries.js'

// A Router is a mini-app that holds a group of related routes. app.js mounts it with app.use(), which keeps app.js small as the project grows.
const router = express.Router();


router.get('/login', (req, res)=>{
    res.redirect('/')
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
// Handles the login form on the home page (views/index.ejs).
router.post('/login', (req,res)=>{
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;
    if (!email || !password){
        return res.status(400).send('Email and Password are required')
    };

    // The same error is sent for a wrong email or password, so nobody can find out which emails are registered.
    const user = findUserByEmail(email);
    const passwordMatches = user && bcrypt.compareSync(password, user.passwordHash);
    if (!passwordMatches){
        return res.status(401).send('Incorrect email or password!')
    }

    // Storing the id in the session is what keeps the user logged in.
    req.session.userId = user.id;

    res.redirect("/")
});

// Logs the user out: deletes the session on the server and the session cookie in the browser.
router.post('/logout', (req, res)=>{
    req.session.destroy(()=>{
        res.clearCookie('connect.sid');
        res.redirect('/')
    })
});

export default router
