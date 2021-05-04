const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/user");

// check user id
exports.checkApplicant = asyncHandler(async (req, res, next) => {
  try {
    const { applicant_id } = req.body;
    console.log("applicnt id ", applicant_id);
    const user = await User.findById(applicant_id);
    console.log("user ", user);
    if (user) {
      next();
    } else {
      return next(new ErrorResponse("Applicant not found", 404));
    }
  } catch (err) {
    return next(new ErrorResponse("Applicant check failed", 401));
  }
});
