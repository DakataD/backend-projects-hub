const router = require('express').Router();
const recipesServices = require('../services/recipesServices');

const { isAuth } = require('../middleware/authMiddleware');

router.get('/catalog', async (req, res) => {
    let recipes = await recipesServices.getAll();
    res.render('recipes/catalog', {recipes});
});

router.get('/add-recipes', (req, res) => {
    res.render('recipes/create')
});

router.post('/add-recipes', isAuth, async (req, res) => {
    try {
        await recipesServices.create({ ...req.body, owner: req.user._id });
        res.redirect('/recipes/catalog');
    } catch (error) {
        console.log(error);
        res.render('recipes/create', { error: getErrorMessage(error) });
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
    let recipes = await recipesServices.getOne(req.params.id);
    let recipesData = await recipes.toObject();
    let recCount = recipesData.recommend.length

    let isOwner = recipesData.owner == req.user?._id;
    let recipesOwner = await recipesServices.findOwner(recipes.owner).lean();

    let recommended = recipes.getRecommend();
    let isRecommended = req.user && recommended.some(c => c._id == req.user?._id);

    res.render('recipes/details', { ...recipesData, isOwner, isRecommended, recipesOwner, recCount })
});

async function isOwner(req, res, next) {
    let recipes = await recipesServices.getOne(req.params.id);

    if (recipes.owner == req.user._id) {
        res.redirect(`/recipes/${req.params.id}/details`);
    } else {
        next();
    }
}

async function checkIsOwner(req, res, next) {
    let recipes = await recipesServices.getOne(req.params.id);

    if (recipes.owner == req.user._id) {
        next();
    } else {
        res.redirect(`/recipes/${req.params.id}/details`);
    }
};

router.get('/:id/delete', checkIsOwner, async (req, res) => {
    try {
        await recipesServices.delete(req.params.id);

        res.redirect('/recipes/catalog');
    } catch (error) {
        res.render('recipes/create', { error: getErrorMessage(error) });
    }

});

router.get('/:id/edit', async (req, res) => {
    let recipes = await recipesServices.getOne(req.params.id);
    res.render('recipes/edit', { ...recipes.toObject() })
});

router.post('/:id/edit', checkIsOwner, async (req, res) => {
    try {
        console.log(await recipesServices.updateOne(req.params.id, req.body));

        res.redirect(`/recipes/${req.params.id}/details`);
    } catch(error) {
        console.log(getErrorMessage(error));
        res.render('recipes/create', { error: getErrorMessage(error) });
    }

});

router.get('/:id/recommend', isOwner, async (req, res) => {
    let recipes = await recipesServices.getOne(req.params.id);

    recipes.recommend.push(req.user);
    await recipes.save();

    res.redirect(`/recipes/${req.params.id}/details`);

});

module.exports = router;