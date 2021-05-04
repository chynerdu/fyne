const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const sendEmail = require("../../utils/sendEmail");
const Job = require("../../models/jobs");
const Applicants = require("../../models/applicants");
const mongoose = require("mongoose");

// @desc shortlist an applicant
// @route post /api/applicants/shortlist/:jobId
// @access public

exports.shortListApplicant = asyncHandler(async (req, res, next) => {
  const { applicant_id } = req.body;

  let job = await Job.findById(req.params.id);
  if (!job) {
    next(new ErrorResponse(`Job not found`, 404));
  }

  // check if user owns the job
  if (job.user != req.user.id) {
    next(
      new ErrorResponse(
        `You don't have access to shortlist candidate for this job`,
        401
      )
    );
  }
  // check if applicant already shortlisted

  let applicantExist = job.shortlistedApplicants.some(
    (item) => item == applicant_id
  );
  console.log("applicant exist ", applicantExist);
  if (applicantExist == true) {
    next(
      new ErrorResponse(
        `You have already shortlisted this applicant for this job`,
        400
      )
    );
  } else {
    console.log("shortlisting applicants");

    // let application_info = {
    //   applicant: applicant_id,

    // };
    job = await Job.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: { shortlistedApplicants: applicant_id },
      }
    );
    res.status(201).json({
      success: true,
      statusCode: 201,
      result: {
        data: job,
      },
    });
  }
});
