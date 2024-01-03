const mongojs = require('mongojs');
const db = mongojs('grabaketak', ['users']);
const path = require('path');
const fs = require('fs');
const { uploadFolder } = require('./config');

const bannerBeginning = "------------ Audio zaharren garbiketa hasieratzen ------------";
const bannerEnding = "------------   Audio zaharren garbiketa amaitua   ------------"
const executionIntervalDays = 1;
const projectRoot = path.resolve(__dirname, '..');

const cleanup = async () => {
    const cleanupTime = new Date();
    cleanupTime.setDate(cleanupTime.getDate() - executionIntervalDays);
    const cleanupTimeMs = cleanupTime.getTime();

    await db.users.find({ "date" : { "$lt" : cleanupTimeMs }},
        (error, userFiles) => {
            console.log(bannerBeginning);
            if (error) {
                console.error(error);
                return console.log(bannerEnding);
            }
            deleteOldUserEntries(userFiles);
            console.log(bannerEnding);
        }
    );
};

const deleteOldUserEntries = userEntries => {
    userEntries.forEach(async element => {
        const filename = element.filename;
        await db.users.remove({ "filename" : filename },
            error => {
                if (error) {
                    console.error(`Errorea datu-basetik ${filename} duen tupla ezabatzean. Error:`, error);
                }
                const filePath = path.join(projectRoot, uploadFolder, filename);
                fs.unlink(filePath, error => {
                    if (error) {
                        console.error(`Errorea sistematik ${filename} izena duen fitxategia ezabatzean. Error:`, error);
                    }
                    else {
                        console.log(`${filename} fitxategia ezabatu da.`);
                    }
                });
            }
        );
    });
}

module.exports = cleanup;