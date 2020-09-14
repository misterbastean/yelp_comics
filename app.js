// =====================
// IMPORTS
// =====================
// NPM Imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');

// Config Import
const config = require('./config');

// Route Imports
const comicRoutes = require('./routes/comics');
const commentRoutes = require('./routes/comments');
const mainRoutes = require("./routes/main");
const authRoutes = require("./routes/auth");

// Model Imports
const Comic = require('./models/comic');
const Comment = require('./models/comment');
const User = require('./models/user');


// =====================
// DEVELOPMENT
// =====================
// Morgan
app.use(morgan('tiny'))

// Seed the DB
// const seed = require('./utils/seed');
// seed();

// =====================
// CONFIG
// =====================
// Body Parser Config
app.use(bodyParser.urlencoded({extended: true}));

// Mongoose Config
mongoose.connect(config.db.connection, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
mongoose.Promise = global.Promise;

// Express Config
app.set("view engine", "ejs");
app.use(express.static('public'));

// Express Session Config
app.use(expressSession({
	secret: "sdfoisdfo87vsdfogsfinsfi76sdiuyfgvsdif6vgsdufgvisdfvgsdufyvgd",
	resave: false,
	saveUninitialized: false
}));

// Method Override Config
app.use(methodOverride('_method'));

// Passport Config
app.use(passport.initialize());
app.use(passport.session());  // Allows persistent sessions
passport.serializeUser(User.serializeUser());  // What data should be stored in session
passport.deserializeUser(User.deserializeUser());  // Get the user data from the stored session
passport.use(new LocalStrategy(User.authenticate()));  // Use the local strategy

// Current User Middleware Config
app.use((req, res, next) => {
	res.locals.user = req.user;
	next();
})

// Route Config
app.use("/", mainRoutes);
app.use("/", authRoutes);
app.use("/comics", comicRoutes);
app.use("/comics/:id/comments", commentRoutes);


// =====================
// LISTEN
// =====================
app.listen(3000, () => {
	console.log("yelp_comic is running...");
});