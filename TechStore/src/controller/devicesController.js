const router = require('express').Router();

const devicesServices = require('../services/devicesServices');
const { isAuth } = require('../middleware/authMiddleware');

async function isOwner(req, res, next) {
    let devices = await devicesServices.getOne(req.params.devicesId);

    if (devices.owner == req.user._id) {
        res.redirect(`/devices/${req.params.devicesId}/details`);
    } else {
        next();
    }
}

async function checkIsOwner(req, res, next) {
    let devices = await devicesServices.getOne(req.params.devicesId);

    if (devices.owner == req.user._id) {
        next();
    } else {
        res.redirect(`/devices/${req.params.devicesId}/details`);
    }
}

router.get('/catalog', async (req, res) => {
    let devices = await devicesServices.getAll();
    res.render('devices/catalog', { devices });
});

router.get('/create-offer', isAuth, async (req, res) => {
    res.render('devices/create');
})

router.post('/create-offer', isAuth, async (req, res) => {
    console.log(req.body);
    try {
        await devicesServices.create({ ...req.body, owner: req.user });
        res.redirect('/devices/catalog');
    } catch (error) {
        console.log(error);
        res.render('devices/create', { error: getErrorMessage(error)})
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

router.get('/:devicesId/details', async (req, res) => {
    let devices = await devicesServices.getOne(req.params.devicesId);

    let devicesData = devices.toObject();

    let isOwner = devicesData.owner == req.user?._id;

    let devicesOwner = await devicesServices.findOwner(devices.owner).lean();

    let prefer = devices.getPrefered();

    let isPrefered = req.user && prefer.some(c => c._id == req.user?._id);

    res.render('devices/details', { ...devicesData, isOwner, isPrefered, devicesOwner });
});

router.get('/:devicesId/prefer', async (req, res) => {
    const devicesId = req.params.devicesId
    let devices = await devicesServices.getOne(devicesId);

    devices.preferedList.push(req.user._id);
    await devices.save();
    res.redirect(`/devices/${req.params.devicesId}/details`);
});

router.get('/:devicesId/edit', checkIsOwner, async (req, res) => {
    const devicesId = req.params.devicesId;
    let devices = await devicesServices.getOne(devicesId);
    res.render('devices/edit', { ...devices.toObject() });
});

router.post('/:devicesId/edit', checkIsOwner, async (req, res) => {
    try {
        const devicesId = req.params.devicesId;
        const devicesData = req.body;
        await devicesServices.update(devicesId, devicesData);
        res.redirect(`/devices/${devicesId}/details`);
    } catch (error) {
        res.render('devices/edit', { error: getErrorMessage(error)});
    }

});

router.get('/:devicesId/delete', checkIsOwner, async (req, res) => {
    const devicesId = req.params.devicesId;
    await devicesServices.delete(devicesId);
    res.redirect('/devices/catalog');
})

module.exports = router;