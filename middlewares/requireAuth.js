// Middleware for routes that need a logged-in user: put it before the route handler, e.g. router.post('/posts', requireAuth, ...).
// It stops the request with 401 if nobody is logged in; otherwise next() passes it on to the route.
export function requireAuth(req, res, next){
    if(!req.session.userId){
        return res.status(401).json({error: "Please log in first"});
    }
    next()
}