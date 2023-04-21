const database = require('../db');

module.exports = {
    upload: (message, userId, roomId, timeStamp) => {
        database.query("INSERT INTO messages (message, user_id, room_id, time_stamp) VALUES (?, ?, ?, ?)",
        [message, userId, roomId, timeStamp], (err, results) => {
            if (err) throw err;
        });
    },
    getPrevMessages: (roomName) => {
        return new Promise((resolve, reject) => {
            database.query("SELECT messages.message, users.username, messages.time_stamp FROM messages JOIN rooms ON messages.room_id = rooms.id JOIN users ON messages.user_id = users.id WHERE rooms.room_name = ? ORDER BY messages.id", 
                            [roomName], (err, results) => {
            if (err) reject(err);
            if (results.length > 0) {
                resolve(results);
            }});
        });
    }
}