// Entry point: sets up Express, mounts the routers and starts the server (ES modules).
import express from 'express';
import postRoute from './routes/posts.js';
import authRoute from './routes/auth.js';
import liveReload from './config/liveReload.js';
import session from 'express-session';
import { loadUser } from './middlewares/loadUser.js';
import { getAllPosts } from './data/postQueries.js';

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
// Puts the logged-in user (or null) on res.locals.user for the views. Must come after session(), which creates req.session.
app.use(loadUser)

// Page routes. Registered after loadUser so the pages know who is logged in. The object passed to res.render() becomes the template's variables.
app.get('/', (req,res)=>{
    const category = req.query.category;    // from the category links in index.ejs (?category=...); undefined on plain / (All)
    const posts = getAllPosts(category);
    res.render('index', {title: "Home", posts, activeCategory: category || 'All' })
})
// Feature routers.
app.use(postRoute)
app.use(authRoute)

// 404: runs only when no route above matched the URL. Must stay after all the routers.
app.use((req, res) => {
    res.status(404).render('error', { title: 'Page not found', message: 'The page you are looking for does not exist.' });
});

// 500: Express calls this when a route throws an error. The four parameters are what make it an error handler,
// so `next` must stay even though it is unused. The details are logged for us, never shown to the user.
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render('error', { title: 'Something went wrong', message: 'Please try again later.' });
});

// Starts the server on http://localhost:3000.
app.listen(port, ()=>{
    console.log("server is running on port " + port)
})
