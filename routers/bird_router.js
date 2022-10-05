const express = require('express');
var bird_controller = require('../controllers/bird_controller');

/* create a router (to export) */
const router = express.Router();

/* route the default URL: `/birds/ */
router.get('/', async (req, res) => {
    // extract the query params
    const search = req.query.search;
    const status = req.query.status;
    const sort = req.query.sort;

    // render the Pug template 'home.pug' with the filtered data
    res.render('home', {
        birds: bird_controller.filter_bird_data(search, status, sort)
    });
})

// TODO: finishe the "Create" route(s)
router.get('/create', (req, res) => {
    // currently does nothing except redirect to home page
    res.render('create');
    res.redirect('/birds/create');
});
router.post('/create', async (req, res) => {
    // currently does nothing except redirect to home page
    res.redirect('/');
});

router.post('/edit', async (req, res) => {
    // currently does nothing except redirect to home page
    res.redirect('/birds/edit');
});

// TODO: get individual bird route(s)
router.get('/:id', async (req, res) => {
    // currently does nothing except redirect to home page
    res.redirect('/birds/${bird.id}');
});

// TODO: Update bird route(s)
router.get('/update', async (req, res) => {
    // currently does nothing except redirect to home page
    res.redirect('/birds/${bird.id}/update');
});

// TODO: Delete bird route(s)
router.get('/delete', async (req, res) => {
    // currently does nothing except redirect to home page
    res.redirect('/birds/${bird.id}/delete');
});


module.exports = router; // export the router