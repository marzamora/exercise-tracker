const mongoose = require('mongoose')

const { Schema } = mongoose;

const exerciseSchema = {
    _uid: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
}

module.exports = mongoose.model('Exercise', exerciseSchema)