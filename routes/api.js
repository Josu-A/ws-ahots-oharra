const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongojs = require('mongojs');
const db = mongojs('grabaketak', ['users']);
const path = require('path');
const fs = require('fs');

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
    await db.users.find({ "name" : id },
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

router.get('/list/:id', async (req, res) => {
    return res.status(200).json(await handleList(req.params.id));
});

router.post('/upload/:name', async (req, res) => {
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
    
        db.users.insert(newAudioEntry, async (error, audioEntry) => {
            if (error) {
                console.error(error);
                return res.status(404).json({ "error" : "Audio berriaren metadatua ez da sartu data basean." });
            }
            console.log(audioEntry);
            return res.status(201).json(await handleList(req.params.name));
        });
    });
});

router.post('/delete/:name/:filename', async (req, res) => {
    await db.users.findOne({ "$and" : [{ "name" : req.params.name }, { "filename" : req.params.filename }] }, async (error, audioEntry) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ "error" : "Internal Server Error" });
        }
        else if (!audioEntry) {
            return res.status(404).json({ "error" : "Erabiltzaile honek ez du izen horreko audiorik" });
        }
        const audioEntryFileName = audioEntry.filename;
        const audioEntryId = audioEntry._id;

        await db.users.remove({ "_id" : audioEntryId }, err => {
            if (err) {
                console.error(err);
                return res.status(404).json({ "error" : "Audioa ez da ezabatu." });
            }
            const projectRoot = path.resolve(__dirname, '..');
            const filePath = path.join(projectRoot, uploadFolder, audioEntryFileName);
            fs.unlink(filePath, async error => {
                if (error) {
                    console.error('Errorea fitxategia ezabatzean: ', error);
                    return res.status(404).json({ "error" : "Audio fitxategia ez da ezabatu." });
                }
                console.log(`${audioEntryFileName} fitxategia ezabatu da.`);
                return res.status(200).json(await handleList(req.params.name));
            });
        });
    });
});

router.get('/play/:filename', (req, res) => {
    // recordings karpetatik :filename irakurri
    // ez balego, errore bat bueltatu (404)
    // bestela datubasean :filename horren azken atzipen data eguneratu
    // bukatzeko, fitxategia bidali sendFile erabiliz
})

module.exports = router;