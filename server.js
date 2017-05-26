//express instances
//exxpress is a web application framework
var express= require("express"),
	hbs= require("hbs"),
	bodyParser=require("body-parser"),
	bcrypt = require("bcrypt-nodejs"),
	mongoose = require('mongoose'),
	app = express(),
	passport = require("passport"),
	//express-session allows you to stay on the application for a max amount of time
	session = require("express-session");
	User = require("./user"),
	localAuth = require("./auth"),

app.set("view engine", "hbs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended:true
}));
//set or use session

app.use(session({
	secret: 'itsASecret',
	resave: true,
	saveUnitialized: true
}));
//want to initialize passport
//passport is what we use for authentication either OAuth and user, passport uses OAuth
app.use(passport.initialize());
app.use(passport.session());
//using another script auth.js(localAuth) contains all our passport, we are passing passport in it. locaAuth is a file and we are passing the parameter
//OAuth--> open authenticatoon that allows you to log in using the credential you alre
localAuth(passport);

app.get("/", function (req, res) {
	res.render("index");
})

app.get("/login", function(req, res){
	res.render("login");
})

app.get("/signup", function(req, res){
	res.render("signup");
})

app.post("/login", passport.authenticate("local-login",{
	successRedirect:"/user",
	failureRedirect: "/login"
}));

//posting to the server
app.post("/signup", function(req, res){
	//creating a new user username and password
	new User({
		username : req.body.username,
		password: bcrypt.hashSync(req.body.password)
		//saving the user in the data-base
	}).save(function(err){
		// if the person already exit it will give you an err
		if(err){
			console.log(err);
		}else{
			//else it will route you to the login page
			res.redirect("/login");
		}
	});
});
//whenever we log our user name, we create an object call req.user name and it will provides information of our username
app.get("user", function(req, res){
	res.render("user", {
		user: req.user
	});
});

//app.get("/data", function(req, res){
//	res.render("data");
//})

//connect our database
mongoose.connect("mongodb://localhost/user");
app.listen(8080);
console.log("server is running");

