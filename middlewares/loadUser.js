import { getUserById } from "../data/userQueries.js";

// Runs on every request (registered in app.js after the session) and looks up the logged-in user.
// Anything on res.locals is available in every view, so templates can check `locals.user` without each route passing it.
export function loadUser(req, res, next){
    res.locals.user = req.session.userId ? getUserById(req.session.userId) :null;
    next();
}