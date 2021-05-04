const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const sendEmail = require("../../utils/sendEmail");
const Job = require("../../models/jobs");
const Applicants = require("../../models/applicants");
const mongoose = require("mongoose");

// @desc post job
// @route POST /api/job
// @access private

exports.postJob = asyncHandler(async (req, res, next) => {
  const {
    description,
    number_of_workers,
    price_per_worker,
    job_type,
  } = req.body;

  const user = req.user.id;
  const _id = new mongoose.Types.ObjectId();
  const job = await Job.create({
    _id,
    description,
    number_of_workers,
    price_per_worker,
    job_type,

    user,
  });
  res.status(201).json({
    success: true,
    statusCode: 201,
    result: {
      data: job,
    },
  });
});

// @desc get all jobs
// @route get /api/job
// @access public

exports.getAllJobs = asyncHandler(async (req, res, next) => {
  let jobs = await Job.find({}, { applicants: 0 }).populate("user");
  // console.log("is populated ", jobs.populated("author"));
  res.status(200).json({
    statusCode: 200,
    success: true,
    data: jobs,
  });
});

// @desc get my jobs
// @route get /api/job/myJobs
// @access private

exports.getMyJobs = asyncHandler(async (req, res, next) => {
  let jobs = await Job.find({ user: req.user.id }, { applicants: 0 }).populate(
    "applicants"
  );
  // console.log("is populated ", jobs.populated("author"));
  res.status(200).json({
    statusCode: 200,
    success: true,
    data: jobs,
  });
});

// @desc apply for a job
// @route post /api/job/apply/:jobId
// @access public

exports.applyForJob = asyncHandler(async (req, res, next) => {
  const { message } = req.body;

  let job = await Job.findById(req.params.id);
  if (!job) {
    next(new ErrorResponse(`Job not found`, 404));
  }

  // check if applicant already exist

  // jobExist = await Job.find({
  //   $and: [
  //     { _id: req.params.id },
  //     {
  //       applicants: {
  //         $elemMatch: { applicant: req.user.id },
  //       },
  //     },
  //   ],
  // });
  // let jobExist = job.applicants.some((item) => item.applicant == req.user.id);
  // check if applicant already applied for the job
  // const applicantExist = await Applicants.find({
  //   $and: [
  //     { job: req.params.id },
  //     {
  //       user: req.user.id,
  //     },
  //   ],
  // });
  // get applicantList so I can use for other checks
  const applicantList = await Applicants.find({ job: req.params.id });
  const applicantExist = applicantList.some((item) => item.user == req.user.id);
  console.log("job exist", applicantExist);
  if (applicantExist == true) {
    next(new ErrorResponse(`You have already applied for this job`, 400));
  } else {
    console.log("saving applicants");

    // let application_info = {
    //   applicant: req.user.id,
    //   message: message,
    // };
    // job = await Job.findOneAndUpdate(
    //   { _id: req.params.id },
    //   {
    //     $set: { applicant_count: job.applicants.length + 1 },
    //     $push: { applicants: application_info },
    //   }
    // );
    const _id = new mongoose.Types.ObjectId();
    const job = req.params.id;
    const user = req.user.id;

    const result = await Applicants.create({
      _id,
      job,
      user,
      message,
    });

    await Job.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { applicant_count: applicantList.length + 1 } }
    );
    res.status(201).json({
      success: true,
      statusCode: 201,
      result: {
        data: result,
      },
    });
  }
});

exports.getMyJobWithApplicants = asyncHandler(async (req, res, next) => {
  let job = await Job.findById(req.params.id).populate("applicants");

  if (job.user != req.user.id) {
    next(new ErrorResponse(`You don't have access to view this job`, 401));
  } else {
    res.status(200).json({
      statusCode: 200,
      success: true,
      data: job,
    });
  }
});
