// Import the necessary packages
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const database = require('../db')

// This function initializes the passport strategy with the provided getUserByEmail and getUserById functions
function initialize(passport) {

    // This function will be called when the user attempts to log in
    const authenticateUser = async (username, password, done) => {

        database.query("SELECT * FROM users WHERE username=?", [username], async (err, results) => {
            if (err) throw err;
            if (results.length > 0) {
                const user = results[0];

                if (await bcrypt.compare(password, user.password)) {
                    return done(null, user);
                }
                else {
                    return done(null, false, {message: 'Incorrect password'});
                }
            }
            else {
                return done(null, false, {message: "Username not found"});
            }
        });
    }

    // Set up the LocalStrategy with the authenticateUser function and the usernameField as 'username'
    passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser));

    // Serialize the user object to store the user ID in the session
    passport.serializeUser((user, done) => done(null, user.id))

    // Deserialize the user object to retrieve the user from the database based on the user ID stored in the session
    passport.deserializeUser((id, done) => {
        database.query("SELECT * FROM users WHERE id=?", [id], (err, results) => {
            if (err) throw err;
            return done(null, results[0]);
        });
    });
}

// Export the initialize function for use in other modules
module.exports = initialize
