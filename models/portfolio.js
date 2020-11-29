const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const PortfolioSchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, "Please add upload Image"],
  },
  user_id: {
    type: String,
    required: [true, "Please add user id"],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password

module.exports = mongoose.model("Portfolio", PortfolioSchema);
