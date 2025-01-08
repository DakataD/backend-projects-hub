const router = require('express').Router();
const planetsServices = require('../services/plantesServices');

const { isAuth } = require('../middleware/authMiddleware');

router.get('/catalog', async (req, res) => {
    let planets = await planetsServices.getAll();    
    res.render('planets/catalog', { planets });
});

router.get('/create', (req, res) => {
    res.render('planets/create')
});

router.post('/create', isAuth, async (req, res) => {
    try {
        await planetsServices.create({ ...req.body, owner: req.user._id });
        res.redirect('/planets/catalog');
    } catch (error) {
        console.log(error);
        res.render('planets/create', { error: getErrorMessage(error) });
    }
});

function getErrorMessage(error) {
    let errorsArr = Object.keys(error.errors);

    if (errorsArr.length > 0) {
        return error.errors[errorsArr[0]];
    } else {
        return error.message
    }

}

router.get('/:id/details', async (req, res) => {
    let planets = await planetsServices.getOne(req.params.id);
    let planetsData = await planets.toObject();

    let isOwner = planetsData.owner == req.user?._id;
    let planetsOwner = await planetsServices.findOwner(planets.owner).lean();

    let likedLists = planets.getLiked();
    let isLiked = req.user && likedLists.some(c => c._id == req.user?._id);

    res.render('planets/details', { ...planetsData, isOwner, isLiked, planetsOwner })
});

async function isOwner(req, res, next) {
    let planets = await planetsServices.getOne(req.params.id);

    if (planets.owner == req.user._id) {
        res.redirect(`/planets/${req.params.id}/details`);
    } else {
        next();
    }
}

async function checkIsOwner(req, res, next) {
    let planets = await planetsServices.getOne(req.params.id);

    if (planets.owner == req.user._id) {
        next();
    } else {
        res.redirect(`/plants/${req.params.id}/details`);
    }
};

router.get('/:id/delete', checkIsOwner, async (req, res) => {
    try {
        await planetsServices.delete(req.params.id);
        res.redirect('/planets/catalog');
    } catch (error) {
        res.render('planets/create', { error: getErrorMessage(error) });
    }

});

router.get('/:id/edit', async (req, res) => {
    let planets = await planetsServices.getOne(req.params.id);
    res.render('planets/edit', { ...planets.toObject() })
});

router.post('/:id/edit', checkIsOwner, async (req, res) => {
    try {
        console.log(await planetsServices.updateOne(req.params.id, req.body));

        res.redirect(`/planets/${req.params.id}/details`);
    } catch (error) {
        console.log(getErrorMessage(error));
        res.render('planets/create', { error: getErrorMessage(error) });
    }

});

router.get('/:id/like', isOwner, async (req, res) => {
    let planets = await planetsServices.getOne(req.params.id);

    planets.liked.push(req.user);
    await planets.save();

    res.redirect(`/planets/${req.params.id}/details`);

});

module.exports = router;