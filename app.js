import express from 'express';
import post_route from './routes/posts.js';
import auth_route from './routes/auth.js';
import comments_route from './routes/comments.js'
import liveReload from './config/liveReload.js';

const app = express();
const port = 3000

//View engine setup
app.set('view engine', 'ejs');
app.set('views', './views');

//Live reload (dev only)
await liveReload(app);

app.use(express.static('public'))

app.get('/', (req,res)=>{
    res.render('index', {title: "Home" })
})
app.get('/article', (req,res)=>{
    res.render('article', {title: "article"})
})

app.use(post_route)
app.use(auth_route)
app.use(comments_route)

app.listen(port, ()=>{
    console.log("server is running on port " + port)
})
