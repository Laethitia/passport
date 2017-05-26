var mongoose = require("mongoose");
//creating a new user schema or template,
// export it in mongoose so it can be required in different files
var User = new mongoose.Schema({
	username: String,
	password: String,

});

module.exports = mongoose.model("User", User);