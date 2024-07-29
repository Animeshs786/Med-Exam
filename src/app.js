const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");

const { appRoutes } = require("./routes/appRoutes");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

//body parser middleware
app.use(express.json());

//cors middleware
app.use(cors());
app.use(morgan("dev"));

//cookie parser middleware
app.use(cookieParser());

// Middleware to set io instance to req object
app.use((req, res, next) => {
  if (req.app.locals.io) {
    req.io = req.app.locals.io;
    req.users = req.app.locals.users;
  }
  next();
});

// testing middleware
app.use("/", (req, res, next) => {
  // console.log(req.body);
  next();
});

//routes
appRoutes(app);

// unhandle route middleware
app.all("*", (req, res, next) => {
  return next(
    new AppError(`The route ${req.originalUrl} not run on this server.`, 404)
  );
});

// global error middleware
app.use(globalErrorHandler);

module.exports = app;
