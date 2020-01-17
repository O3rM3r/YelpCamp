const Campground = require("../models/campground");
const Comment = require("../models/comment");

let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req,res,next) => {
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err,foundCampground) => {
            if(err || !foundCampground) {
                console.log(err);
                req.flash("error", "Campground not found");
                res.redirect("/campgrounds");
            } else {
                //does user own the campground?
                if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });    
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}


middlewareObj.checkCommentOwnership = (req,res,next) => {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err,foundComment) => {
            if(err || !foundComment) {
                req.flash("error", "Comment not found");
                res.redirect("/campgrounds");
            } else {
                //does user own the comment? (author.id is the author id that gets inputted into the comment 
                //by the schema, when he posts the comment. req.user._id is the currently logged in user by mongoose)
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });    
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = (req,res,next) => {
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;