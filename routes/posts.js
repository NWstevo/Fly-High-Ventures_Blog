// Post routes:
// GET /api/posts       all posts as JSON (public)
// GET /api/posts/:id   one post as JSON (public)
// GET /posts           the signed-in user's own posts, as a page
// POST /posts          create a post (logged in)
// PUT/DELETE /posts/:id edit or delete (logged in, author only)
// GET/POST /publish    the publish form and its submission
import express from "express";

import { getAllPosts, getPostById, getPostsByAuthor, createPost, deletePost, updatePost } from "../data/postQueries.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

// Public: all posts as JSON. ?category=... filters by category.
router.get('/api/posts', (req, res) => {
    const posts = getAllPosts(req.query.category);
    res.json(posts);
});

// Public: one post as JSON.
router.get('/api/posts/:id', (req, res) => {
    const post = getPostById(Number(req.params.id));

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
});

// Signed in: the logged-in user's own posts, shown as a page.
router.get('/posts', requireAuth, (req, res) => {
    const posts = getPostsByAuthor(req.session.userId);
    res.render('my_posts', { title: 'My Posts', posts });
});

// Create a post. requireAuth runs first, so this only runs for logged-in users.
router.post('/posts', requireAuth, (req, res) => {
    const title = req.body.title?.trim();
    const content = req.body.content?.trim();
    const category = req.body.category?.trim() || 'General';

    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required.' });
    }

    // The author is the logged-in user, taken from the session rather than the form.
    const id = createPost({
        title,
        content,
        category,
        authorId: req.session.userId,
    });

    res.status(201).json(getPostById(id));
});

// Edit a post. 404 if it does not exist, 403 if the logged-in user is not its author.
router.put('/posts/:id', requireAuth, (req, res) => {
    const post = getPostById(Number(req.params.id));

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    if (post.authorId !== req.session.userId) {
        return res.status(403).json({ error: 'You can only edit your own posts' });
    }

    // ?? keeps the old value if the field is not sent at all
    const title = req.body.title?.trim() ?? post.title;
    const content = req.body.content?.trim() ?? post.content;
    const category = req.body.category?.trim() || post.category;

    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content cannot be empty' });
    }

    updatePost(post.id, { title, content, category });
    res.json(getPostById(post.id));
});

// Delete a post, with the same 404/403 checks as editing. 204 means it worked and there is nothing to send back.
router.delete('/posts/:id', requireAuth, (req, res) => {
    const post = getPostById(Number(req.params.id));

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    if (post.authorId !== req.session.userId) {
        return res.status(403).json({ error: 'You can only delete your own posts' });
    }

    deletePost(post.id);
    res.status(204).end();
});

// The publish form.
router.get('/publish', requireAuth, (req, res) => {
    res.render('publish', { title: 'Publish' });
});

// Publishing from the form. Saves the post, then returns to the home page.
router.post('/publish', requireAuth, (req, res) => {
    const title = req.body.title?.trim();
    const content = req.body.content?.trim();
    const category = req.body.category?.trim() || 'General';

    if (!title || !content) {
        return res.status(400).send('Title and content are required');
    }

    createPost({
        title,
        content,
        category,
        authorId: req.session.userId,
    });

    res.redirect('/');
});



export default router;