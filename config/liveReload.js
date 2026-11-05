//Live reload: refresh the browser when views/ or public/ change (dev only)
// REVIEW: Two tools work together during development:
// REVIEW:   - nodemon (npm run dev) restarts the Node server when server-side files change.
// REVIEW:   - livereload refreshes the browser when templates, styles or images change.
// REVIEW: package.json tells nodemon to ignore public/ and views/, so editing those
// REVIEW: reloads the page without restarting the whole server.

/**
 * REVIEW: Attaches live-reload support to the Express app. Does nothing in production.
 * @param {import('express').Express} app - the Express application to attach the middleware to
 * @returns {Promise<void>}
 */
export default async function liveReload(app) {
    if (process.env.NODE_ENV === 'production') return;

    // REVIEW: Dynamic import() loads these packages only when this line runs. They are
    // REVIEW: devDependencies, so they are not installed in production and a static
    // REVIEW: import at the top of the file would crash there.
    const { default: livereload } = await import('livereload');
    const { default: connectLivereload } = await import('connect-livereload');

    // REVIEW: Starts a separate livereload server (port 35729 by default) that watches
    // REVIEW: these folders and tells connected browsers to refresh when a file changes.
    const liveReloadServer = livereload.createServer({ exts: ['ejs', 'css', 'js', 'html', 'png', 'jpg', 'svg'] });
    liveReloadServer.watch(['./views', './public']);

    //After nodemon restarts the server, reload the page once the browser reconnects
    liveReloadServer.server.once('connection', () => {
        setTimeout(() => liveReloadServer.refresh('/'), 100);
    });

    // REVIEW: Middleware that injects the livereload <script> tag into every HTML response,
    // REVIEW: which is how the browser connects to the livereload server.
    app.use(connectLivereload());
}
