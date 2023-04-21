const database = require('../db')

module.exports = {
  getRoomByName: (roomName) => {
      return new Promise((resolve, reject) => {
        database.query("SELECT * FROM rooms WHERE room_name = ?", [roomName], (err, results) => {
          if (err) reject(err);
          if (results.length > 0) {
            resolve(results[0].id);
          } else {
            reject(new Error(`No room found with name ${roomName}`));
          }
        });
      });
    }
}