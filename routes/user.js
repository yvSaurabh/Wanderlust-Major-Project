const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userContrroller = require("../controllers/users.js");

router.route("/signup")
        .get(userContrroller.renderSignupForm)
        .post(wrapAsync(userContrroller.signup));

router.route("/login")
     .get(userContrroller.renderLoginForm)
     .post(saveRedirectUrl, passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }), wrapAsync(userContrroller.login));



router.get("/logout", wrapAsync(userContrroller.logout)
);

module.exports = router;
