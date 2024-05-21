const jwt = require('jsonwebtoken');

//Load the secret key from environment variable or configuration file
const secretKey = process.env.ACCESS_TOKEN_SECRET || 'damars';

const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, secretKey, { expiresIn: '1h' }); // Set token expiration time as needed
};

module.exports = { generateAccessToken, secretKey };
