const router = require('express').Router();

const homeController = require('./controller/homeController');
const authController = require('./controller/authController');
const recipesController = require('./controller/recipesController');

router.use(homeController);
router.use('/auth', authController);
router.use('/recipes', recipesController);
router.use('/*', (req, res) => {
    res.render('404');
});
module.exports = router;