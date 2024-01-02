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
        console.log("Uploading received file in folder: ", uploadFolder);
        cb(null, uploadFolder);
    },
    "filename" : function(req, file, cb) {
        if (!file) {
            console.log("something went wrong :(");
            cb(null, '');
        }
        else {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const newFileName = `${uniqueSuffix}`;
            console.log("New name for received file: ", newFileName);
            cb(null, newFileName);
        }
    }
});

const upload = multer({
    "storage" : storage,
    "fileFilter" : function(req, file, cb) {
        const acceptedMimeTypes = ['audio/ogg'];
        const isValid = !file || acceptedMimeTypes.includes(file.mimetype);
        console.log("Received file is valid? ", isValid);
        cb(null, isValid);
    },
    "limits" : {
        "fileSize" : 2.5 * 1024 * 1024
    }
}).single('recording');

const handleList = async (id) => {
    return new Promise((resolve, reject) => {
        let filesFromUser = [];
        db.users.find({ "name" : id },
            { "filename" : 1, "date" : 1, "_id" : 0 },
            { "$sort" : { "date" : -1 }, "limit" : 5 },
            (error, userFiles) => {
                if (error) {
                    console.error(error);
                    reject(error);
                }
                else {
                    filesFromUser = userFiles;
                    console.log('Retrieved data from DB: ', filesFromUser);
                    resolve({ "files" : filesFromUser });
                }
            }
        );
    });
    
};

router.get('/list/:id', async (req, res) => {
    try {
        const filesObject = await handleList(req.params.id);
        return res.status(200).json(filesObject);
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/upload/:name', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ "error" : err });
        }
    
        const newAudioEntry = {
            "name" : req.params.name,
            "filename" : req.file.filename,
            "date" : Date.now(),
            "accessed" : Date.now(),
            "size" : req.file.size
        };
    
        db.users.insert(newAudioEntry, async (error, audioEntry) => {
            if (error) {
                console.error(error);
                return res.status(404).json({ "error" : "Audio berriaren metadatua ez da sartu datu-basean." });
            }
            console.log('New DB entry: ', audioEntry);
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

router.get('/play/:filename', async (req, res) => {
    const projectRoot = path.resolve(__dirname, '..');
    const filePath = path.join(projectRoot, uploadFolder, req.params.filename);

    try {
        fs.readFile(filePath);
        await db.users.update({ "filename" : req.params.filename },
            { "$set" : { "accessed" : Date.now() } }
        );
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Errorea fitxategia bidaltzean:', err);
                return res.status(500).json({ "error" : "Internal Server Error" });
            }
            console.log(`${req.params.filename} fitxategia ondo bidalia`);
        });
    }
    catch (error) {
        console.error('Errorrea fitxategia irakurtzen:', error);
        return res.status(404).json({ "error" : "Audio fitxategia ez da aurkitu." });
    }
});

module.exports = router;