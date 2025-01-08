const router = require('express').Router();
const planetsServices = require('../services/plantesServices');

router.get('/', async (req, res) => {
    res.render('home');
});

router.get('/search', async (req, res) => {
    let planetsName = req.query.name;
    let planetsSystem = req.query.solarSystem;

    let planets = await planetsServices.search(planetsName, planetsSystem);

    if (planets == undefined) {
        planets = await planetsServices.getAll();
    }
    res.render('search', { planets })
})

module.exports = router;