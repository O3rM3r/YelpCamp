const express       = require('express');
const bodyParser    = require('body-parser');
const mongoose      = require('mongoose');
const flash         = require('connect-flash');
const passport      = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const Campground    = require("./models/campground");
const Comment       = require("./models/comment");
const User          = require("./models/user");
const seedDB        = require("./seeds");
const app           = express();


//requiring routes
const campgroundRoutes  = require("./routes/campgrounds");
const commentRoutes     = require("./routes/comments");
const indexRoutes       = require("./routes/index");

//=====mongodb config==========
//mongoose for local mongodb, defined the localhost to be DATABASEURL ($export = DATABASEURL=mongodb://localhost:27017/yelp_camp)
//mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true }); //no need for this

//mongoose for mongodb atlas, deinfed to be DATABASEURL for heroku
//password replace with actual password
// mongoose.connect("mongodb+srv://omerYelpCamp:<password>@yelpcamp-mxf5f.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

//environment variable for db
//good to hide the password when uploading the project publicly
//after the || is the default route in case it can't find a predefined one
var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //deletes all campgrounds and comments, and enters 3 new ones

app.locals.moment = require('moment'); //momentJS

//Passport config
app.use(require("express-session")({
    secret:"Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//requests the user object from passport and usses it at currentUser
app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//Routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});