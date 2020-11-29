const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const User = require("../../models/user");
const Portfolio = require("../../models/portfolio");

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

// @desc logged in user get portfolio images
// @route GET /api/v1/user/portfolio
// @access Private

exports.getLoggedInUserPortfolio = asyncHandler(async (req, res, next) => {
  // find user with id
  let user = await User.findById(req.user.id);
  if (!user) {
    next(new ErrorResponse(`User not found`, 404));
  }

  let portfolio = await Portfolio.find({ user_id: req.user.id });

  res.status(200).json({
    statusCode: 201,
    success: true,
    data: portfolio,
  });
});
