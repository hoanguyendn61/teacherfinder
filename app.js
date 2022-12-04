const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Teacher = require("./models/teacher");
const User = require("./models/user");
const Comment = require("./models/comment");
const flash = require("connect-flash");

const seedDB = require("./seeds");
const passport = require("passport");
const methodOverride = require("method-override");
const LocalStrategy = require("passport-local");

const commentRoutes = require("./routes/comments");
const TeacherRoutes = require("./routes/teachers");
const AdminRoutes = require("./routes/admin");
const indexRoutes = require("./routes/index");
const reviewRoutes = require("./routes/reviews");
mongoose.connect(process.env.DATABASE_URL);

// mongoose.connect("mongodb://localhost/27017");

app.locals.moment = require("moment");
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");

app.use(flash());

// PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "Once again blabla",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/teachers", TeacherRoutes);
app.use("/admin", AdminRoutes);
app.use("/teachers/:id/comments", commentRoutes);
app.use("/teachers/:id/reviews", reviewRoutes);

//=============================================================================
//Starts the server

app.listen(process.env.PORT, process.env.IP, function () {
  console.log("The server has started! at ", process.env.PORT);
});
