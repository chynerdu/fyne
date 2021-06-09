const mongoose = require("mongoose");
const User = require("./user");
const Schema = mongoose.Schema;

const ApplicantSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  job: {
    type: Schema.Types.ObjectId,
    ref: "Job",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password
module.exports = mongoose.model("Applicants", ApplicantSchema);
