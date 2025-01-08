const mongoose = require('mongoose');

let recipiesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50
    },
    ingredients: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 200
    },
    instructions: {
        type: String,
        required: true,
        minLength: 10,
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
    recommend: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        }
    ],

});

recipiesSchema.method('getRecommend', function () {
    return this.recommend.map(x => x._id);
})

let Recipies = mongoose.model('Recipes', recipiesSchema);

module.exports = Recipies;