const mongojs = require('mongojs');
const db = mongojs('grabaketak', ['users']);
const path = require('path');
const fs = require('fs');

const uploadFolder = 'recordings/';
const executionIntervalDays = 0;

const cleanup = async () => {
    const cleanupTime = new Date();
    cleanupTime.setDate(cleanupTime.getDate() - executionIntervalDays);

    await db.users.remove({ "date" : { "$lt" : cleanupTime.getTime() }},
        (err, docs, lastErrorObject) => {
            console.log(err);
            console.log(docs);
            console.log(typeof(docs));
            console.log(lastErrorObject);
        }
    );
};

module.exports = cleanup;