const bcrypt = require('bcryptjs');

// Show login form
const showLoginForm = (req, res) => {
  res.render('login', {
    title: 'Login',
    error: req.query.error
  });
};

// Handle login
const login = (req, res) => {
  const { password } = req.body;
  const appPassword = process.env.APP_PASSWORD;

  if (!password) {
    return res.redirect('/login?error=Password is required');
  }

  if (password === appPassword) {
    req.session.isAuthenticated = true;
    return res.redirect('/?message=Logged in successfully&messageType=success');
  }

  res.redirect('/login?error=Invalid password');
};

// Handle logout
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/?message=Logged out successfully&messageType=success');
  });
};

module.exports = {
  showLoginForm,
  login,
  logout
};
