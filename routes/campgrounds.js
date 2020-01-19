const express       = require("express");
const router        = express.Router();
const Campground    = require("../models/campground");
const Comment       = require('../models/comment');
const middleware    = require('../middleware'); //automatically requires 'index.js'
const multer        = require('multer'); //uploading img
const cloudinary    = require('cloudinary'); //storing images API

//==========configuring image upload==========
//creating a custom file name using the current date using Date.now() and the original file's name
let storage = multer.diskStorage({
    filename: (req, file, callback) => {
        callback(null, Date.now() + file.originalname);
    }
});
//making sure file extension is an image
let imageFilter = (req, file, cb)=>{
    //accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)){
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true)
};
//the variable we upload
let upload = multer({storage: storage, fileFilter: imageFilter})
//cloudinary configuring
cloudinary.config({
    cloud_name: 'omerma',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

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
router.post("/", middleware.isLoggedIn, upload.single('image'), (req, res) => {
    cloudinary.uploader.upload(req.file.path, (result)=>{
        //adding cloudinary url for img to cmpgrnd obj under img property
        req.body.campground.image = result.secure_url;
        //add author to campground
        req.body.campground.author = {
            id: req.user._id,
            username: req.user.username
        }
        //Creat new campground and save to DB
        //we can use req.body.campground instead of defining each property of the object because we used campground[xxx] in the form names
        Campground.create(req.body.campground, (err,newlyCreated) => {
            if(err){
                console.log(err);
                req.flash('error', err.message);
                return res.redirect('back');
            }
            console.log(newlyCreated);
            res.redirect("/campgrounds/" + newlyCreated.id);
        });
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