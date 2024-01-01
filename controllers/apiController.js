const mongojs = require('mongojs');
const db = mongojs('grabaketak', ['users']);

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

module.exports = {
    handleList
};