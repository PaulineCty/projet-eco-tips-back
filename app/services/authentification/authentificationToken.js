// require('dotenv').config();
const jwt = require('jsonwebtoken');

const authentificationToken = {

  generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
  },

  isAuthenticated(req, res, next) {
    const authHeader = req.headers.authorization;
    //authHeader format is "Bearer token" hence the .split(' ')[1]
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ errorMessage : 'Veuillez vous authentifier pour accéder à cette page.' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        next(new APIError("Unauthorized", 401));
      }
      req.user = user;
      next();
    });
  },

  removeAccessToken(req,res) {
    req.headers.authorization = null;
  }

}

module.exports = authentificationToken;
  
// app.get('/api/me', authentificationToken.isAuthenticated, (req, res) => {
//  res.send(req.user);
// });

