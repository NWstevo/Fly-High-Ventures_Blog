// Middleware for routes that need a logged-in user: put it before the route handler, e.g. router.post('/posts', requireAuth, ...).
// If nobody is logged in, a page visit (GET) is redirected to the home page with the login modal open,
// and anything else (form submits, fetch calls) gets a 401 JSON error. Otherwise next() passes the request on to the route.
export function requireAuth(req, res, next){
    if (!req.session.userId){
        if(req.method === 'GET'){
            return res.redirect('/?login=1');
        }
        return res.status(401).json({error: "Please log in first"})
    }
    next()
}