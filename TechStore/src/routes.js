const router = require('express').Router();

const homeController = require('./controller/homeController');
const authController = require('./controller/authController');
const devicesController = require('./controller/devicesController');

router.use(homeController);
router.use('/auth', authController);
router.use('/devices', devicesController);
router.use('/*', (req, res) => {
    res.render('404');
})

module.exports = router;