const router = require('express').Router();
const devicesServices = require('../services/devicesServices');
const { isAuth } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
    let getTop = await devicesServices.getTopThree().lean();
    res.render('home', { getTop });
});

router.get('/about', async (req, res) => {
    res.render('about');
});

router.use('/profile',isAuth, async (req, res) => {
    const userId = req.user._id;
    let prefered = await devicesServices.getMyPrefered(userId);
    let created = await devicesServices.getMyCreatedDevices(userId);

    res.render('profile', {created, prefered});
});

module.exports = router