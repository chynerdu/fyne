const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const sendEmail = require("../../utils/sendEmail");
const User = require("../../models/user");

// @desc Register
// @route POST /api/v1/auth/register
// @access public

exports.register = asyncHandler(async (req, res, next) => {
  const {
    first_name,
    last_name,
    phone,
    email,
    password,
    role,
    gender,
    profileImage,
  } = req.body;

  const user = await User.create({
    first_name,
    last_name,
    phone,
    email,
    password,
    role,
    gender,
    profileImage,
  });

  //  send email

  try {
    await sendEmail({
      email: user.email,
      name: user.first_name,
      subject: "Welcome Onboard",
      // message,
    });
  } catch (error) {
    console.log(error);

    // await user.save({ validateBeforeSave: false });
    // return next(new ErrorResponse("Email could not be sent", 500));
  }

  // const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  // try {
  //   await sendEmail({
  //     email: user.email,
  //     subject: "Password reset token",
  //     message,
  //   });

  //   res.status(200).json({
  //     success: true,
  //     data: "Email sent",
  //   });
  // } catch (error) {
  //   console.log(error);
  //   user.resetPasswordToken = undefined;
  //   user.resetPasswordExpire = undefined;

  //   await user.save({ validateBeforeSave: false });
  //   return next(new ErrorResponse("Email could not be sent", 500));
  // }

  sendTokenResponseWithBody(user, 200, res);
});

// @desc Login
// @route POST /api/v1/auth/login
// @access public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse("Please provided email and password", 400));
  }

  // check user
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  // check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendTokenResponseWithBody(user, 200, res);
  // check if its first time login
  if (user.firstTimeLogin) {
    user.firstTimeLogin = 0;
    await user.save();
  }
});

// Get token from model, creatae cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  console.log("user ", user);
  // CREATE token and cookie
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token: token });
};

// @desc get user profile
// @route GET /api/v1/auth/getMe
// @access Private

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    statusCode: 200,
    result: {
      data: user,
    },
  });
});

// Get token from model, creatae cookie and send response
const sendTokenResponseWithBody = (user, statusCode, res) => {
  let result = {
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    gender: user.gender,
    firstTimeLogin: user.firstTimeLogin,
  };
  // CREATE token and cookie
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      statusCode: statusCode,
      result: {
        data: result,
        token: token,
      },
    });
};
