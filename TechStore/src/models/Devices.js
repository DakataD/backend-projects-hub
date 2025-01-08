const mongoose = require('mongoose');

let devicesSchema = new mongoose.Schema({
    brand: {
        type: String,
        require: true,
        minLength: 2
    },
    model: {
        type: String,
        require: true,
        minLength: 5
    },
    hardDisk: {
        type: String,
        require: true,
        minLength: 5
    },
    screenSize: {
        type: String,
        require: true,
        minLength: 1
    },
    ram: {
        type: String,
        require: true,
        minLength: 2
    },
    operatingSystem: {
        type: String,
        require: true,
        minLength: 5,
        maxLength: 20
    },
    cpu: {
        type: String,
        require: true,
        minLength: 10,
        maxLength: 50
    },
    gpu: {
        type: String,
        require: true,
        minLength: 10,
        maxLength: 50
    },
    price: {
        type: Number,
        require: true,
        minValue: 0
    },
    color: {
        type: String,
        require: true,
        minLength: 2,
        maxLength: 10
    },
    weight: {
        type: String,
        require: true,
        minLength: 1
    },
    image: {
        type: String,
        require: true,
        validate: /^https?:\/\//i,

    },
    preferedList: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        }
    ],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

devicesSchema.method('getPrefered', function () {
    return this.preferedList.map(x => x._id);
});

devicesSchema.method('getUsername', function () {
    return this.preferedList.map(x => x.username);
})

let Course = mongoose.model('Devices', devicesSchema);

module.exports = Course;