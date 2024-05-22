// userModel.js
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'bxz4dicr6ya8xfrbxerm-mysql.services.clever-cloud.com',
    user: 'uuw5itqameu58txn',
    password: 'lKmOWaqVYYQfzswQFfg7',
    database: 'bxz4dicr6ya8xfrbxerm'
}); // Assuming you have a database connection

const getUserByUsername = (username, callback) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    pool.query(query, [username], (error, results) => {
        if (error) {
            callback(error, null);
            return;
        }
        callback(null, results[0]); // Assuming username is unique, so we return the first result
    });
};

module.exports = { getUserByUsername };
