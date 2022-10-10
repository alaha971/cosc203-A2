const express = require('express');
const profile = require('../models/dbSchema');
var bird_controller = require('../controllers/bird_controller');
var mongoose = require('mongoose');
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
        birds: await bird_controller.filter_bird_data(search, status, sort)
    });
})

router.get('/create', async (req, res) => {
    res.render('create');
});

router.post('/create', async (req, res) => {
    const bird = new profile({
        _id: new mongoose.mongo.ObjectId(),
        primaryName: req.body.primaryName,
        englishName: req.body.englishName,
        scientificName: req.body.scientificName,
        order: req.body.order,
        family: req.body.family,
        otherName: req.body.otherName,
        status: req.body.status,
        photo: {
            credit: req.body.credit,
            source: req.body.source
        },
        size: {
            length: {
                value: req.body.length,
                units: "cm"
            },
            weight: {
                value: req.body.weight,
                units: "g"
            }
        }
    });

    try {
        const newBird = await bird.save();
        console.log(newBird);
        // res.status(201).json(newBird);
        res.redirect('/');
    } catch (err) {
        res.status(400).json({ message: err.message })
    }

});

router.get('/:id/edit', async (req, res) => {
    const id = req.params.id;
    const b = await profile.findOne({ _id: id })

    res.render('edit', {
        birds: b,
    });

});

router.get('/:id/delete', async (req, res) => {
    const id = req.params.id;
    const db_info = await profile.findOneAndRemove({ _id: id })
    res.redirect('/');
});

// TODO: get individual bird route(s)
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    // console.log(id);

    const b = await profile.findOne({ _id: id })

    // render the Pug template 'home.pug' with the filtered data

    // res.redirect(id);
});

// TODO: Update bird route(s)
router.post(':id/update', async (req, res) => {

    const db_info = await profile.updateOne(
        { _id: id },
        { primary_name: req.body.primary_name },
        { english_name: req.body.english_name },
        { scientific_name: req.body.scientific_name },
        { order: req.body.order },
        { family: req.body.family },
        { other_name: req.body.other_name },
        { status: req.body.status },
        //     { photo: { credit: req.body.photo.credit },
        //              { source: req.body.photo.source } },
        // { size: { length: req.body.size.length },
        //     { weight: req.body.size.weight }
        // },
    )

    // console.log(db_info, `birds/${birds._id}`);
    // response.status(200).send("success! edited message");
    const b = await profile.findOne({ _id: id })

    res.render('edit', {
        birds: b,
    });
});



module.exports = router; // export the router