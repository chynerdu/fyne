const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const States = require("../../models/state");
const Lga = require("../../models/lga");

// @desc Get meta data
// @route GET /api/v1/metaData
// @access Public

exports.getMetaData = asyncHandler(async (req, res, next) => {
  // get states
  const state = await States.find();
  const meta_data = {
    states: state,
  };
  res.status(200).json({
    statusCode: 200,
    success: true,
    data: meta_data,
  });
});

exports.getLGA = asyncHandler(async (req, res, next) => {
  // get states
  const lga = await Lga.find({ state_id: req.params.id });
  console.log("id ", lga.length);
  if (lga.length == 0) {
    next(
      new ErrorResponse("Local government for selected state not found", 400)
    );
  }

  res.status(200).json({
    statusCode: 200,
    success: true,
    data: lga,
  });
});
