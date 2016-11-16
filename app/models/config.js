// app/models/configs.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var sessionConfigSchema = mongoose.Schema({
    secret : String,
    resave : Boolean,
    saveUninitialized : Boolean
}, {collection: "configs"});

// methods ======================
// generating a hash
/*userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};*/

// create the models and expose them to our app
exports.sessionConfigSchema = mongoose.model('config', sessionConfigSchema);