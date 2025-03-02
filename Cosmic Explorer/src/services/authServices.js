const jwt = require('../utils/jwt');
const User = require('../models/User');
const { JWT_Secret } = require('../constants');

exports.register = (userData) => User.create(userData);

exports.login = async ({ username, password }) => {
    let user = await User.findOne({ username });
    console.log(username, password);
    
    if (!user) {
        throw new Error('Invalid username or password');
    };

    let isValid = await user.validatePassword(password);

    if (!isValid) {
        throw new Error('Invalid username or password');
    }

    let payload = {
        _id: user._id,
        username: user.username,
    }

    let token = await jwt.sign(payload, JWT_Secret);

    return token;
}