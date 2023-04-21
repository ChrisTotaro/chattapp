const database = require('../db');
const bcrypt = require('bcrypt');

module.exports = {
    getUsers: (req, res) => {
        database.query("SELECT * FROM users", (err, results) => {
            if (err) throw err;
            res.render('admin/index', {title: 'Users', users: results});
        })
    },

    getUserByUsername: (username) => {
        console.log('Querying for username', username);
        return new Promise((resolve, reject) => {
            database.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
            if (err) throw err;
            if (results.length > 0) {
                console.log('Results:', results[0].id)
                resolve(results[0].id);
            } else {
                reject(new Error(`No user found with username: ${username}`));
            }
            });
        });
    },

    createUser: async (req, res) => {
        let { fname, lname, username, email, password } = req.body;
        console.log('USERName:', username);
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if email is available
        database.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
            if (err) throw err;
            if (results.length > 0) {
                req.flash('err_msg', "This email is already being used");
                res.redirect('/register');
            }
            else {
                // Check if username is available
                database.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
                    if (err) throw err;
                    if (results.length > 0) {
                        req.flash('err_msg', "This username is already being used");
                        res.redirect('/register');
                    }
                    else {
                        database.query("INSERT INTO users (fname, lname, username, email, password) VALUES (?, ?, ?, ?, ?)",
                        [fname, lname, username, email, hashedPassword], (err, results) => {
                            if (err) throw err;
                            req.flash('success_msg', 'Successfully Registered')
                            res.redirect('/login');
                        });
                    }
                });
            }
        });
    }

}