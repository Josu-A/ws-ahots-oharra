const mongojs = require('mongojs');
const db = mongojs('grabaketak', ['users']);
const path = require('path');
const fs = require('fs');

const { uploadFolder } = require('./config');

const executionIntervalDays = 5;
const projectRoot = path.resolve(__dirname, '..');

const deleteFileAndEntry = async filename => {
    return new Promise((resolve, reject) => {
        db.users.remove({ "filename" : filename }, error => {
            if (error) {
                console.error(`Errorea datu-basetik ${filename} duen tupla ezabatzean. Error:`, error);
            }
            const filePath = path.join(projectRoot, uploadFolder, filename);
            fs.unlink(filePath, error => {
                if (error) {
                    console.error(`Errorea sistematik ${filename} izena duen fitxategia ezabatzean. Error:`, error);
                    reject(error);
                }
                else {
                    console.log(`${filename} fitxategia ezabatu da.`);
                    resolve();
                }
            });
        });
    });
}

const deleteOldAudioEntries = audioEntries => {
    audioEntries.forEach(async entry => {
        const filename = entry.filename;
        await deleteFileAndEntry(filename);
    });
}

const cleanup = () => {
    const cleanupTime = new Date();
    cleanupTime.setDate(cleanupTime.getDate() - executionIntervalDays);
    const cleanupTimeMs = cleanupTime.getTime();

    db.users.find({ "date" : { "$lt" : cleanupTimeMs }},
        (error, audioEntries) => {
            console.log('------------ Audio zaharren garbiketa hasieratzen ------------');
            if (error) {
                console.error(error);
            }
            else {
                deleteOldAudioEntries(audioEntries);
            }
            console.log('------------   Audio zaharren garbiketa amaitua   ------------');
        }
    );
};

module.exports = cleanup;
