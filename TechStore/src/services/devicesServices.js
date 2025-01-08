const Devices = require('../models/Devices');
const User = require('../models/User');

exports.create = (devicesData) => Devices.create(devicesData);

exports.getAll = () => Devices.find().lean();

exports.getTopThree = () => Devices.find().sort({createdAt: -1}).limit(3);

exports.findUser = (userId) => User.findById(userId);

exports.findOwner = (userId) => User.findById(userId);

exports.getMyPrefered = (userId) => Devices.find({ preferedList: userId}).lean();

exports.getMyCreatedDevices = (userId) => Devices.find({ owner: userId}).lean();

exports.getOne = (devicesId) => Devices.findById(devicesId).populate('preferedList');

exports.delete = (devicesId) => Devices.findByIdAndDelete(devicesId);

exports.update = (devicesId, devicesData) => Devices.findByIdAndUpdate(devicesId, devicesData);