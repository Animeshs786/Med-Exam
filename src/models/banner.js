const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  image: String,
  webImage: String,
  webUrl: String,
  url: String,
  type: {
    type: String,
    enum: ["TestSeries", "Notes", "Course", "Live", "Recorded"],
    required: true,
  },
  redirectType: {
    type: String,
    default: "Internal",
    enum: ["Internal", "External"],
  },
  priority: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Banner = mongoose.model("Banner", bannerSchema);
module.exports = Banner;
