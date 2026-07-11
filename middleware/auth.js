const authMiddleware = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }
  
  res.redirect('/login');
};

module.exports = authMiddleware;
