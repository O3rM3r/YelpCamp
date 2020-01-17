const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const Campground = require("../models/campground");

//root route
router.get("/", (req, res) => {
    res.render("landing");
});

//====================
//Authentication Routes

//show register form
router.get("/register", (req,res) => {
    res.render("register", {page:'register'});
});
//sign up logic
router.post("/register", (req,res) => {
    let newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
    });
    if(req.body.adminCode === 'secretcode123'){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, (err,user) => {
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req,res, function() {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//show log in form
router.get("/login", (req, res) => {
    res.render("login", {page:'login'});
});
//log in logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req,res) => {
    
});

//log out
router.get("/logout", (req,res) => {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

//users profile
router.get("/users/:user_id", (req,res)=>{
    User.findById(req.params.user_id, (err,foundUser)=>{
        if(err){
            req.flash("error","Something went wrong");
            res.redirect("/");
        }
        Campground.find().where('author.id').equals(foundUser._id).exec((err,campgrounds)=>{
            if(err){
                req.flash("error","Something went wrong");
                res.redirect("/");
            }
            res.render("users/show", {user: foundUser, campgrounds: campgrounds});
        });
    });
});

module.exports = router;