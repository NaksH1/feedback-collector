const jwt = require('jsonwebtoken');


const secret = 'S@cr$t';

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secret, (err, user) => {
      if (err)
        return res.sendStatus(403);
      req.user = user;
      next();
    });
  }
  else {
    res.sendStatus(401);
  }
}

const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    }
    else {
      res.status(403).json({ message: 'Access denied' });
    }
  };
}

module.exports = {
  authenticateJwt,
  checkRole
}
