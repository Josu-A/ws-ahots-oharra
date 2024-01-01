var express = require('express');
var router = express.Router();
const mongojs = require('mongojs');
const db = mongojs('grabaketak', ['users']);
const multer = require('multer');

const uploadFolder = 'upload/';

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
        const acceptedMimeTypes = ['audio/vorbis'];
        cb(null, !file || acceptedMimeTypes.includes(file.mimetype));
    },
    "limits" : {
        "fileSize" : 10 * 1024 * 1024
    }
});

const handleList = async (id) => {
    let filesFromUser = [];
    db.users.find({ "name" : id },
        { "filename" : 1, "date" : 1, "_id" : 0 },
        { "$sort" : { "date" : -1 }, "limit" : 5 },
        (error, userFiles) => {
            if (error) {
                console.error(error);
            }
            else {
                filesFromUser = userFiles;
            }
        });
    return { "files" : filesFromUser };
};

router.get('/list/:id', (req, res) => {
    res.json(handleList(req.params.id));
});

module.exports = router;