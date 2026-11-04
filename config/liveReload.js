//Live reload: refresh the browser when views/ or public/ change (dev only)
export default async function liveReload(app) {
    if (process.env.NODE_ENV === 'production') return;

    const { default: livereload } = await import('livereload');
    const { default: connectLivereload } = await import('connect-livereload');

    const liveReloadServer = livereload.createServer({ exts: ['ejs', 'css', 'js', 'html', 'png', 'jpg', 'svg'] });
    liveReloadServer.watch(['./views', './public']);

    //After nodemon restarts the server, reload the page once the browser reconnects
    liveReloadServer.server.once('connection', () => {
        setTimeout(() => liveReloadServer.refresh('/'), 100);
    });

    app.use(connectLivereload());
}
