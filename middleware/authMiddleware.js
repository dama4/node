const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).send({ error: 'Unauthorized: Missing Authorization header' });
  }
  
  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).send({ error: 'Unauthorized: Missing token' });
  }

  jwt.verify(token, 'damars', (err, decodedToken) => { // Use the secret key here
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).send({ error: 'Unauthorized: Token has expired' });
      }
      return res.status(403).send({ error: 'Forbidden: Invalid token' });
    }
    req.user = decodedToken;
    next();
  });
};

module.exports = { authenticateToken };
