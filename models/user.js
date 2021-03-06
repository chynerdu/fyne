const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, "Please add first name"],
  },
  last_name: {
    type: String,
    required: [true, "Please add last name"],
  },
  phone: {
    type: String,
    required: [true, "Please add phone number"],
  },
  gender: {
    type: String,
    required: [true, "Please add gender"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  role: {
    type: String,
    enum: ["admin", "client", "service-provider"],
    default: "client",
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  state: {
    type: String,
    // required: [true, "Please add last name"],
  },
  lga: {
    type: String,
    // required: [true, "Please add last name"],
  },
  address: {
    type: String,
    // required: [true, "Please add last name"],
  },
  lat: {
    type: Number,
    // required: [true, "Please add last name"],
  },
  long: {
    type: Number,
    // required: [true, "Please add last name"],
  },
  experience: {
    type: String,
    // required: [true, "Please add last name"],
  },
  portfolio: {
    type: Array,
  },
  profileImage: {
    type: String,
  },
  firstTimeLogin: {
    type: Boolean,
    default: 1,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// sign JWT token
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// match user entered password to has password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
