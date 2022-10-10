const mongoose = require('mongoose');

const birdSchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    primary_name: String,
    english_name: String,
    scientific_name: String,
    order: String,
    family: String,
    other_names: String,
    status: String,
    photo: {
        credit: String,
        source: String,
    },
    size: {
        length: {
            value: Number,
            units: String
        },
        weight: {
            value: Number,
            units: String
        },
    },

})

module.exports = mongoose.model('Bird', birdSchema)