const mongoose              = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: {type:String, unique: true, required: true},
    password: String,
    avatar: String,
    firstName: String,
    lastName: String,
    email: {type:String, unique: true, required: true},
    resetPasswordToken: String, //gets set by the token in routes/index.js -> forgot password
    resetPasswordExpires: Date, //gets set by the date defined in routes/index.js -> forgot password
    isAdmin: {type:Boolean, default:false}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);