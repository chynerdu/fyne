const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const User = require("../../models/user");

// @desc Update User
// @route POST /api/v1/user/:id
// @access Private

exports.updateProfile = asyncHandler(async (req, res, next) => {
  // find user with id
  let user = await User.findById(req.params.id);
  if (!user) {
    next(new ErrorResponse(`User not found`, 404));
  }
  // make sure is owner
  console.log("user ", user);
  console.log("user ", req.user);
  if (user.id !== req.user.id) {
    next(new ErrorResponse("User is not unauthorized", 401));
  }

  // update user
  user = await User.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});
