const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController= require("../controllers/users.js");


router
.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

router
.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect: "/login", failureFlash:true}),userController.login);


router.get("/logout",userController.logout);

module.exports=router;




//understand how flash working
/*
When you call:

req.flash("success", "Welcome to WanderLust! You are LoggedIn");


→ This stores the message in the session for the next response cycle.

On the next request, in your middleware:

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


→ Flash messages are moved from the session into res.locals, so you can access them in your EJS templates (<%= success %> or loop over them).

That’s why you use req.flash when setting messages, but you use res.locals when reading messages in templates.
 */


/*//yeh hogi async request because database ka andr change karana wala hai
//router.post("/signup",wrapAsync(userController.signup)); */