const Recipies = require('../models/Recipies');
const User = require('../models/User');

exports.create = (recipiesData) => Recipies.create(recipiesData);

exports.getAll = () => Recipies.find().lean();

exports.getOne = (recipiesId) => Recipies.findById(recipiesId).populate('recommend');

exports.delete = (recipiesId) => Recipies.findByIdAndDelete(recipiesId);

exports.findOwner = (userId) => User.findById(userId).lean();

exports.updateOne = (recipiesId, recipiesData) => Recipies.findByIdAndUpdate(recipiesId, recipiesData);

exports.findTheThree = () => Recipies.find({}).sort({ createdAt: -1 }).lean();

exports.search = (recipeText) => {
    if (recipeText) {
        return (Recipies.find({ title: { $regex: recipeText, $options: 'i' } }).lean());
    }
}