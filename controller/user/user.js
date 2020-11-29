const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const User = require("../../models/user");
const Portfolio = require("../../models/portfolio");

// @desc Update User
// @route POST /api/v1/user/:id
// @access Private

exports.updateUser = asyncHandler(async (req, res, next) => {
  // find user with id
  let user = await User.findById(req.params.id);
  if (!user) {
    next(new ErrorResponse(`User not found`, 404));
  }
  // make sure is owner

  if (user.id !== req.user.id) {
    next(new ErrorResponse("User is not unauthorized", 401));
  }

  // update user
  user = await User.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    statusCode: 200,
    success: true,
    data: user,
  });
});

// @desc Update User
// @route PUT /api/v1/user
// @access Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    statusCode: 200,
    success: true,
    data: user,
  });
});

// @desc Uplaod portfolio images
// @route POST /api/v1/user/portfolio
// @access Private

exports.uploadPortfolioImage = asyncHandler(async (req, res, next) => {
  // find user with id
  let user = await User.findById(req.user.id);
  if (!user) {
    next(new ErrorResponse(`User not found`, 404));
  }

  const { portfolio_images } = req.body;
  if (req.body.portfolio_images.length < 0) {
    next(new ErrorResponse("Image can't be empty", 400));
  }

  portfolio_images.forEach((item) => {
    let { image } = item;
    const portfolio = Portfolio.create({
      image,
      user_id: req.user.id,
    });
  });

  res.status(200).json({
    statusCode: 201,
    success: true,
    data: portfolio_images,
  });
});
