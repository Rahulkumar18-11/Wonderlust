const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(`🔐 [AUTHENTICATION SIGNUP] New user successfully registered: '${registeredUser.username}' (Email: ${registeredUser.email}, ID: ${registeredUser._id})`);
    req.login(registeredUser, (err) => {
      if (err) {
        console.error("❌ [AUTHENTICATION LOGIN ERROR] Auto-login after signup failed:", err);
        return next(err);
      }
      console.log(`✅ [AUTHENTICATION LOGIN] Auto-logged in newly registered user: '${registeredUser.username}'`);
      req.flash("success", "Welcome to WanderLust!");
      res.redirect("/listings");
    });
  } catch (error) {
    console.warn(`⚠️  [AUTHENTICATION SIGNUP FAILED] Registration failed:`, error.message);
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  console.log(`✅ [AUTHENTICATION SUCCESS] Session established for user: '${req.user.username}'`);
  req.flash("success", "Welcome back to WanderLust!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  const user = req.user ? req.user.username : "Guest";
  req.logout((err) => {
    if (err) {
      console.error(`❌ [AUTHENTICATION LOGOUT ERROR] Logout failed for '${user}':`, err);
      return next(err);
    }
    console.log(`🚪 [AUTHENTICATION LOGOUT] User '${user}' successfully logged out`);
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};
