const dotenv = require('dotenv')
const path = require('path');
const express = require('express');
const bird_router = require('./routers/bird_router');
const image_router = require('./routers/image_router');

/* load .env */
dotenv.config();

/* create Express app */
const app = express();

/* setup Express middleware */
app.use('/', express.static(path.resolve(__dirname, 'public')));
// Pug for SSR (static site rendering)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// TODO: middleware for parsing POST body
// TODO: middleware for uploading files

/* host static resources (.css, .js, ...) */
app.use('/images/', image_router);
app.use('/', express.static(path.resolve(__dirname, 'public/')));

/* redirect root route `/` to `/birds/` */
app.get('/', (req, res) => {
    res.redirect('/birds/');
});

app.use('/birds/', bird_router);

app.get('*', (request, response) => {
    response.status(404)
    response.sendFile(path.resolve(__dirname, 'public/404.html'));
});

// TODO: connect to a database

/* start the server */
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is live http://localhost:${PORT}`);
});
