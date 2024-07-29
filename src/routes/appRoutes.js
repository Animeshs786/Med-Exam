const express = require("express");

const userRoutes = require("./userRoutes");
const adminRoutes = require("./adminRoutes");
const mentorRoutes = require("./mentorRoutes");

exports.appRoutes = (app) => {
  app.use("/public", express.static("public"));
  app.use("/api/user", userRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/mentor", mentorRoutes);
};
