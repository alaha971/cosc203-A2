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
        primary_name: req.body.primary_name,
        english_name: req.body.english_name,
        scientific_name: req.body.scientific_name,
        order: req.body.order,
        family: req.body.family,
        other_names: req.body.other_names,
        status: req.body.status,
        photo: {
            credit: req.body.photo_credit,
            source: req.body.photo_source
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

    res.render('view', {
        bird: b,
    });
});

// TODO: Update bird route(s)
router.post('/:id/update', async (req, res) => {
    const id = req.params.id;
    console.log(req.body.photo_source);
    const db_info = (
        {
            primary_name: req.body.primary_name,
            english_name: req.body.english_name,
            scientific_name: req.body.scientific_name,
            order: req.body.order,
            family: req.body.family,
            other_names: req.body.other_names,
            status: req.body.status,
            photo: {
                credit: req.body.photo_credit,
                source: req.body.photo_source
            },
            size: {
                length: {
                    value: req.body.length,
                    units: 'cm'
                },
                weight: {
                    value: req.body.weight,
                    units: 'g'
                }
            }
        }
    )

    const filter = { _id: id }
    let doc = await profile.findOneAndUpdate(filter, db_info, {
        new: true
    });
    doc.update();
    console.log(doc);

    // response.status(200).send("success! edited message");
    res.redirect('/');
});



module.exports = router; // export the router