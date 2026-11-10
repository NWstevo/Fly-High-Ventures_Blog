// Entry point: sets up Express, mounts the routers and starts the server (ES modules).
import express from 'express';
import postRoute from './routes/posts.js';
import authRoute from './routes/auth.js';
import liveReload from './config/liveReload.js';
import session from 'express-session';

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

// Body parsing (forms and JSON) and sessions. Registered before the routers so they get req.body and req.session.
// SESSION_SECRET is required in production; in development a fallback secret is used with a warning.
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const isProduction = process.env.NODE_ENV === 'production';
const sessionSecret = process.env.SESSION_SECRET

if (!sessionSecret) {
    if (isProduction) {
        throw new Error('SESSION_SECRET must be set in production');
    }
    console.warn('SESSION_SECRET is not set. Using an insecure development secret.');
}
app.use(session({
    secret: sessionSecret || 'dev-secret-temporal',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly:true,
        maxAge: 1000 * 60 * 60 * 2, // 2 hours
    }
}));

// Feature routers.
app.use(postRoute)
app.use(authRoute)

// Starts the server on http://localhost:3000.
app.listen(port, ()=>{
    console.log("server is running on port " + port)
})
