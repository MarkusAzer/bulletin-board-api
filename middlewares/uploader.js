const multer = require('multer');
const storage = multer.memoryStorage();

const upoader = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const maxSize = 1024 * 256; //256KB
        const fileSize = parseInt(req.headers['content-length']);
        const allowedMimetypes = ['image/png', 'image/jpg'];
        const foundType = allowedMimetypes.filter(allowedMimetype => allowedMimetype == file.mimetype);

        if (empty(foundType)){
            return cb(new CustomError(`Only ${foundType.join(' ')} files allowed!`));
        }

        if (fileSize > maxSize ){
            return cb(new CustomError(`Max Size Allowed ${(maxSize / 1024)/1024} MB`));
        }

        cb(null, true);
    }
});

module.exports = upoader;
