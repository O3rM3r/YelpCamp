const express       = require("express");
const router        = express.Router();
const Campground    = require("../models/campground");
const Comment       = require('../models/comment');
const middleware    = require('../middleware'); //automatically requires 'index.js'

//show all campgrounds
router.get("/", (req,res) => {
    //Get all campgrounds from DB
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground.find({$or:[{name: regex},{"author.username":regex}]}, (err,allCampgrounds) => {
            if(err){
                console.log(err);
            } else {
                if(allCampgrounds.length < 1){
                    req.flash('error', 'Campground not found');
                    res.redirect("back");
                } else {
                    res.render("campgrounds/index", {campgrounds:allCampgrounds, page: 'campgrounds'});
                }
            }
        });
    } else {
        Campground.find({}, (err,allCampgrounds) => {
            if(err){
                console.log(err);
            } else {
                res.render("campgrounds/index", {campgrounds:allCampgrounds, page: 'campgrounds'});
            }
        });
    }
});

//create new campground to db
router.post("/", middleware.isLoggedIn, (req, res) => {
    const name = req.body.name;
    const price = req.body.price;
    const image = req.body.image;
    const desc = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    const newCampground = {name:name, price:price, image:image, description:desc, author:author};
// Creat new campground and save to DB
    Campground.create(newCampground, (err,newlyCreated) => {
        if(err){
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});

//new - show form to create campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

//show - shows more info about one campground
router.get("/:id", (req, res) => {
    //find campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec((err,foundCampground) => {
        if(err || !foundCampground){
            console.log(err);
            req.flash('error', 'Campground not found');
            res.redirect('back');
        } else {
            console.log(foundCampground)
            //render show template
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
    req.params.id
});

//Edit campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req,res) => {
    Campground.findById(req.params.id, (err,foundCampground) => {
        res.render("campgrounds/edit", {campground:foundCampground});
    });    
});

//Update campground
router.put("/:id", middleware.checkCampgroundOwnership, (req,res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Destroy campground
router.delete("/:id", middleware.checkCampgroundOwnership, (req,res) => {
    Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
        if (err) {
            console.log(err);
        }
        //deletes comments inside campground
        Comment.deleteMany( {_id: { $in: campgroundRemoved.comments } }, (err) => {
            if (err) {
                console.log(err);
            }
            res.redirect("/campgrounds");
        });
    });
});

//making the campground search query a "fuzzy search", matching anything similar
function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&");
}

module.exports = router;