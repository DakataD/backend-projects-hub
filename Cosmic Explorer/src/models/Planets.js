const mongoose = require('mongoose');

let planetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 2
    },
    age: {
        type: Number,
        required: true,
        minValue: 0
    },
    solarSystem: {
        type: String,
        required: true,
        minValue: 0
    },
    type: {
        type: String,
        required: true,
        enum: ['Inner', 'Outer', 'Dwarf']
    },
    moons: {
        type: Number,
        required: true,
        minValue: 0
    },
    size: {
        type: Number,
        required: true,
        minValue: 0
    },
    rings: {
        type: String,
        required: true,
        enum: ['Yes', 'No']
    },
    description: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 100
    },
    image: {
        type: String,
        required: true,
        validate: /^https?:\/\//i
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    liked: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        }
    ],

});

planetSchema.method('getLiked', function () {
    return this.liked.map(x => x._id);
})

let Planets = mongoose.model('Planets', planetSchema);

module.exports = Planets;