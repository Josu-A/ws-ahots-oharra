var express = require('express');
var router = express.Router();
const apiController = require('../controllers/apiController');
const multer = require('multer');

const uploadFolder = 'recordings/';

const storage = multer.diskStorage({
    "destination" : function(req, file, cb) {
        cb(null, uploadFolder);
    },
    "filename" : function(req, file, cb) {
        if (!file) {
            cb(null, '');
        }
        else {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const newFileName = `${uniqueSuffix}`;
            cb(null, newFileName);
        }
    }
});

const upload = multer({
    "storage" : storage,
    "fileFilter" : function(req, file, cb) {
        const acceptedMimeTypes = ['audio/ogg'];
        cb(null, !file || acceptedMimeTypes.includes(file.mimetype));
    },
    "limits" : {
        "fileSize" : 2.5 * 1024 * 1024
    }
}).single('recording');

router.get('/list/:id', (req, res) => {
    res.json(apiController.handleList(req.params.id));
});

module.exports = router;