# Fly-High Ventures Blog

A blog for tech news, innovation stories and opportunity pathways. Anyone can read and filter articles; signed-in users can publish their own articles and edit or delete them.

Built with Node.js, Express 5, EJS templates and SQLite.

## Features

- **Browse articles:** the home page lists every article, newest first, as cards with a category tag, author name and a picture for the category.
- **Filter by category:** All, Tech News, Innovations and Opportunity pathways (`/?category=...`).
- **Read an article:** "Read more" opens the full article at `/posts/:id`.
- **Accounts:** sign up with name, email and password, log in and log out from the pop-up on the home page. Passwords are stored as bcrypt hashes, and a session keeps you logged in for 2 hours.
- **Publish:** signed-in users write an article with a title, category and text.
- **My Posts:** a list of your own articles, each with Edit and Delete.
- **Edit and delete:** only the author of an article can edit or delete it. Other users get a 403, and the Edit link is only shown to the author.
- **Protected pages:** visiting Publish or My Posts while logged out sends you to the home page with the login form open.
- **Error pages:** failed forms, unknown articles and unknown URLs show an error page with a link back home.

## Getting started

Requirements: Node.js 18 or newer (developed on Node 24).

```bash
git clone https://github.com/NWstevo/Fly-High-Ventures_Blog.git
cd Fly-High-Ventures_Blog
npm install
npm run dev
```

Then open http://localhost:3000.

- `npm run dev` restarts the server when server files change (nodemon) and reloads the browser when views or styles change (livereload).
  nodemon is set in `package.json` to ignore `views/` and `public/`, so editing a template, stylesheet or image only reloads the page and does not restart the server.
- `npm start` runs the server once, without reloading. Restart it yourself after changing server files.

The SQLite database (`data/blog.db`) and its tables are created automatically the first time the app runs. The database file is not committed, so a fresh clone starts with no users or articles.

### Environment variables

| Variable | Needed | Purpose |
|---|---|---|
| `SESSION_SECRET` | In production | Signs the session cookie. In development a fallback secret is used and a warning is printed. The app refuses to start in production without it. |
| `NODE_ENV` | No | Set to `production` to turn off live reload and require `SESSION_SECRET`. |
| `PORT` | No | The port the server listens on. Defaults to `3000`; hosts such as Render set it automatically. |

The app does not load a `.env` file, so set these in your shell or on your host, for example:

```bash
NODE_ENV=production SESSION_SECRET=a-long-random-string npm start
```

## Deployment (demo only)

The app is deployed as a class demo on [Render](https://render.com)'s free plan, as a Node Web Service:

- Build command: `npm install`
- Start command: `npm start`
- Environment variables: `NODE_ENV=production` and `SESSION_SECRET`

Every push to `main` redeploys it automatically.

> **Demo only: the data does not persist.** The app stores everything in a SQLite file (`data/blog.db`) on the server's disk. Render's free plan has no permanent disk, so the database is reset, and all accounts and articles are lost, whenever the service redeploys, restarts, or goes to sleep after 15 minutes without visitors. The first visit after it sleeps also takes about a minute.
>
> For real use, the data would need a persistent disk (a paid Render plan) or a hosted database such as Postgres.

Netlify does not work for this project. It serves static files, and this app needs a running Node server to build its pages.

## Project structure

```
app.js                  Sets up Express, sessions, the home page route and the 404/500 handlers
config/liveReload.js    Browser live reload during development
data/
  database.js           Opens blog.db and creates the users and posts tables
  postQueries.js        Post queries (posts are joined with users for the author name)
  userQueries.js        User queries (password hashing on sign-up)
middlewares/
  loadUser.js           Puts the logged-in user on res.locals.user for every view
  requireAuth.js        Logged-out page visits are redirected to the login form; other requests get 401
  requirePostAuthor.js  404 if the post does not exist, 403 if the user is not its author
routes/
  auth.js               Sign up, log in, log out
  posts.js              Article pages, publishing, editing, deleting and the JSON API
views/                  EJS templates (home, post, my_posts, publish, edit-post, error, header/footer partials)
public/                 style.css, script.js (login pop-up, Delete button) and images
```

## Routes

### Pages

| Method | Path | Access | What it does |
|---|---|---|---|
| GET | `/` | Everyone | Home page with all articles; `?category=` filters them |
| GET | `/posts/:id` | Everyone | One article |
| GET | `/posts` | Logged in | My Posts |
| GET | `/publish` | Logged in | Publish form |
| POST | `/publish` | Logged in | Saves a new article |
| GET | `/posts/:id/edit` | Author | Edit form |
| POST | `/posts/:id/edit` | Author | Saves the changes |
| POST | `/signup` | Everyone | Creates an account and logs in |
| POST | `/login` | Everyone | Logs in |
| POST | `/logout` | Logged in | Logs out |

### JSON API

| Method | Path | Access | What it does |
|---|---|---|---|
| GET | `/api/posts` | Everyone | All articles; `?category=` filters them |
| GET | `/api/posts/:id` | Everyone | One article |
| POST | `/posts` | Logged in | Creates an article, returns 201 |
| PUT | `/posts/:id` | Author | Updates an article |
| DELETE | `/posts/:id` | Author | Deletes an article, returns 204 (used by the Delete button) |

## Categories

Articles are stored with one of these values. The filter links, the publish and edit forms, and the card pictures all depend on them matching exactly (the comparison is case-sensitive):

| Stored value | Shown as | Card picture |
|---|---|---|
| `General` | General | `bg-image.png` |
| `Tech news` | Tech News | `tech.jpeg` |
| `Innovation` | Innovations | `innovation.jpeg` |
| `Opportunity pathways` | Opportunity pathways | `opportunity.jpeg` |

General has no filter button, so General articles only appear under All.

## Known limitations

- On the deployed demo, the SQLite database is wiped on every redeploy, restart or sleep (see [Deployment](#deployment-demo-only)).
- Dates are shown as stored, in UTC (for example `2026-11-18 11:04:21`).
- Articles have no cover image of their own; each category uses a fixed picture.
- There is no search.
- Sessions are kept in memory, so everyone is logged out when the server restarts. A persistent session store is needed for real use.
- Forms have no CSRF protection yet.
