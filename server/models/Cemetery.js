const mongoose = require('mongoose');

const cemeterySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: String,
    coordinates: {
        type: [Number], // [latitude, longitude]
        index: '2dsphere'
    },
    description: String
});

module.exports = mongoose.model('Cemetery', cemeterySchema);