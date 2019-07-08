const router = require('express').Router();
const { body, param } = require('express-validator');
const uploader = require('../middlewares/uploader');
const {slugify, validate} = require('../utilities');
const { getAllBulletin, getBulletin, streamImage, createBulletin } = require('../services/bulletin');

router.get('/', async(req, res, next)=>{
    try {
        //TODO: in production should use pagination and query Param
        const result = await getAllBulletin();
        return next({ data: result });
    } catch (err) {
        return next(err);
    }

});

router.get('/:id',[ param('id').isNumeric().withMessage('Provide Valid Id') ], async(req, res, next)=>{
    try {
        validate(req);

        const { id } = req.params;
        const result = await getBulletin(id);
        return next({ data: result });
    } catch (err) {
        return next(err);
    }
});

router.get('/image/:id',[ param('id').isNumeric().withMessage('Provide Valid Id') ], async(req, res, next)=>{
    try {
        validate(req);

        const { id } = req.params;
        await streamImage(id, res);

    } catch (err) {
        return next(err);
    }
});

router.post('/', uploader.single("file"),[
    //Validations according business needs
    body('title').exists().withMessage('title is required')
], async (req, res, next) => {
    try {
        validate(req);

        const data = req.body;
        //TODO: in production should be stream Api using aws s3;
        if(!empty(req.file)){
            data.imageType = req.file.mimetype;
            data.imageName = slugify(req.file.originalname);
            data.imageData = req.file.buffer;
        }

        const result = await createBulletin(data);

        return next({ data: result });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;