const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");
const userController = require("../controllers/users.js");

router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    (req, res, next) => {
      console.log(`🔐 [AUTH CHECK] Login attempt for username: "${req.body.username}"`);
      passport.authenticate("local", (err, user, info) => {
        if (err) {
          console.error("❌ [AUTH ERROR] Authentication error:", err);
          return next(err);
        }
        if (!user) {
          console.warn(`⚠️  [AUTH FAILED] Failed login for user: "${req.body.username}". Reason: ${info?.message || "Invalid credentials"}`);
          req.flash("error", info ? info.message : "Invalid username or password!");
          return res.redirect("/login");
        }
        req.login(user, (err) => {
          if (err) {
            console.error("❌ [LOGIN ERROR] Error logging in user:", err);
            return next(err);
          }
          console.log(`✅ [AUTH SUCCESS] User "${user.username}" authenticated successfully!`);
          return userController.login(req, res);
        });
      })(req, res, next);
    }
  );

router.get("/logout", userController.logout);

// Newsletter / Contact Email Submission
router.post("/subscribe", (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    req.flash("error", "Please provide a valid email address!");
  } else {
    console.log(`📧 [NEWSLETTER SUBSCRIBED] Email: ${email}`);
    req.flash("success", `Thank you! Travel inspirations and deals will be sent to ${email}`);
  }
  const redirectUrl = req.get("Referrer") || "/listings";
  res.redirect(redirectUrl);
});

module.exports = router;
