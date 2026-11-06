// Entry point: sets up Express, mounts the routers and starts the server (ES modules).
import express from 'express';
import post_route from './routes/posts.js';
import auth_route from './routes/auth.js';
import liveReload from './config/liveReload.js';

const app = express();
const port = 3000

//View engine setup
// res.render('index') resolves to ./views/index.ejs.
app.set('view engine', 'ejs');
app.set('views', './views');

//Live reload (dev only)
// Awaited so it is registered before the routes below.
await liveReload(app);

// Serves ./public at the root URL (public/style.css -> /style.css).
app.use(express.static('public'))

// Page routes. The object passed to res.render() becomes the template's variables.
app.get('/', (req,res)=>{
    res.render('index', {title: "Home" })
})
app.get('/article', (req,res)=>{
    res.render('article', {title: "article"})
})

// Feature routers. GET '/' in posts.js never runs: app.get('/') above handles it first.
app.use(post_route)
app.use(auth_route)


// Starts the server on http://localhost:3000.
app.listen(port, ()=>{
    console.log("server is running on port " + port)
})
