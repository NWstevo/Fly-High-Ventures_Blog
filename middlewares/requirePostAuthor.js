import { getPostById } from "../data/postQueries.js";

// For routes that change one post: put it after requireAuth, e.g. router.put('/posts/:id', requireAuth, requirePostAuthor, ...).
// Stops with 404 if the post does not exist and 403 if the logged-in user is not its author; otherwise the post is
// put on req.post for the route. Form and page requests (GET/POST) get the error page, fetch calls (PUT/DELETE) get JSON.
export function requirePostAuthor(req, res, next) {
    const post = getPostById(Number(req.params.id));
    const wantsPage = req.method === 'GET' || req.method === 'POST';

    if (!post) {
        return wantsPage
            ? res.status(404).render('error', { title: 'Post not found', message: 'This post does not exist or has been deleted.' })
            : res.status(404).json({ error: 'Post not found' });
    }

    if (post.authorId !== req.session.userId) {
        return wantsPage
            ? res.status(403).render('error', { title: 'Access denied', message: 'You can only change your own posts.' })
            : res.status(403).json({ error: 'You can only change your own posts' });
    }

    req.post = post;
    next();
}
