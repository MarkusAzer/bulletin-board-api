const router = require('express').Router();
const { body } = require('express-validator');
const { validate} = require('../utilities');
const { createComment } = require('../services/comment');

router.post('/', [ 
    body('comment').exists().withMessage('comment is required'),
    body('bulletinId').isNumeric().withMessage('Provide Valid bulletinId').exists().withMessage('bulletinId is required'),
 ], async (req, res, next) => {
    try {
        validate(req);
        const data = req.body;
        const result = await createComment(data);

        return next({ data: result });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;