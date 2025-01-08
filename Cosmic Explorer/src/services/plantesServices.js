const Planets = require('../models/Planets');
const User = require('../models/User');

exports.create = (planetsData) => Planets.create(planetsData);

exports.getAll = () => Planets.find().lean();

exports.getOne = (planetsId) => Planets.findById(planetsId).populate('liked');

exports.delete = (planetsId) => Planets.findByIdAndDelete(planetsId);

exports.findOwner = (userId) => User.findById(userId).lean();

exports.updateOne = (planetsId, planetsData) => Planets.findByIdAndUpdate(planetsId, planetsData);

exports.search = (planetsName, planetsSystem) => {
    if (planetsName) {
        return (Planets.find({ name: {$regex: planetsName, $options: 'i'} }).lean());
    }

    if (!planetsName && planetsSystem) {
        return (Planets.find({ solarSystem: planetsSystem }).lean());
    }

}