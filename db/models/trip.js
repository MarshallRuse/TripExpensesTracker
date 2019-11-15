const mongoose = require('mongoose');
const validator = require('validator');


const tripSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    preferredCurrency: {
        type: String,
        required: true,
        trim: true,
        default: 'CAD'
    },
    owner: [{
        // type: mongoose.Schema.Types.ObjectId,
        // required: true,
        // ref: 'User'
        type: String,
        required: true

    }]
});


const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;