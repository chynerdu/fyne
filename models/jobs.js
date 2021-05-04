const mongoose = require("mongoose");
const User = require("./user");
const Applicants = require("./applicants");
const Schema = mongoose.Schema;

const JobSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  description: {
    type: String,
    required: [true, "Please provide description"],
  },
  number_of_workers: {
    type: Number,
    required: [true, "Please provider number of workers needed"],
  },
  price_per_worker: {
    type: Number,
    required: [true, "Please indicate price per worker"],
  },
  job_type: {
    type: String,
    enum: ["Indoor", "Outdoor"],
    default: "Outdoor",
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  applicant_count: {
    type: Number,
    default: 0,
  },
  shortlistedApplicants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  applicants: [
    {
      type: Schema.Types.ObjectId,
      ref: "Applicants",
    },
  ],
  startDate: {
    type: Date,
    // required: [true, "Please enter start date"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password
module.exports = mongoose.model("Job", JobSchema);
