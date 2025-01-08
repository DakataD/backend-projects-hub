const router = require('express').Router();
const recipesServices = require('../services/recipesServices');

router.get('/', async (req, res) => {
    let recipes = await recipesServices.findTheThree();
    recipes = recipes.slice(0, 3);
    res.render('home', { recipes });
});

router.get('/search', async (req, res) => {
    let recipeText = req.query.search;
    let recipes = await recipesServices.search(recipeText);
    console.log(recipes);
        
    if (recipes == undefined) {
        recipes = await recipesServices.getAll();
    }

    res.render('search', { recipes })
})

module.exports = router;