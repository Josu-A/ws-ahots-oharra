var express = require('express');
var router = express.Router();
const multer = require('multer');
const mongojs = require('mongojs');
const db = mongojs('grabaketak', ['users']);

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
    console.log({"files" : filesFromUser });
    return { "files" : filesFromUser };
};
router.get('/list/:id', (req, res) => {
    let jason = handleList(req.params.id).then(res => res);
    console.log(jason)
    return res.status(200).json(jason);
});

router.post('/upload/:name', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ "error" : err });
        }
    
        const newAudioEntry = {
            "name" : req.params.name,
            "filename" : req.file.filename,
            "date" : Date.now(),
            "accessed" : Date.now()
        };
    
        db.users.insert(newAudioEntry, (error, audioEntry) => {
            if (error) {
                console.error(error);
                return res.status(404).json({ "error" : "Audio berriaren metadatua ez da sartu data basean." });
            }
            console.log(audioEntry);
            return res.status(201).json(handleList(req.params.name));
        });
    });
});

module.exports = router;