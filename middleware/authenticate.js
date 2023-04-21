function checkAuthenicated(req, res, next) {
    if (req.isAuthenticated())
    {
      return next();
    }
  
    res.redirect('/login');
  }
  
  // Function to check if user is not authenticated
  function checkNotAuthenicated(req, res, next) {
    if (req.isAuthenticated())
    {
      return res.redirect('/');
    }
    next();
  }
  
  // Function to check if the user is an admin
  function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.admin) {
      return next();
    }

    /* MAKE A FLASH and redirect to login page if not authenticated */
    
    res.status(403).send('Access denied: You are not authorized to access this page');
  }

  module.exports = {
    checkAuthenicated,
    checkNotAuthenicated,
    isAdmin,
  }