const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "title is required"],
  },
  description: {
    type: String,
  },
  coverImage: {
    type: String,
    default: "default_coverimage.png",
  },
  dp: {
    type: String,
    default: "default_dpimage.jpg",
  },
  video: String,
  userId: {
    type: String,
    required: [true, " User Id is required "],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
