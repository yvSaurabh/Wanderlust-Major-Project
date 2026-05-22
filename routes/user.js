const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userContrroller = require("../controllers/users.js");

router.get("/signup", userContrroller.renderSignupForm);

router.post("/signup", wrapAsync(userContrroller.signup));

router.get("/login", userContrroller.renderLoginForm);

router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    wrapAsync(userContrroller.login));

router.get("/logout", wrapAsync(userContrroller.logout)
);

module.exports = router;
