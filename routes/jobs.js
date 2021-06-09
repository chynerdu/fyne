const express = require("express");
const {
  postJob,
  getAllJobs,
  getMyJobs,
  applyForJob,
  getMyJobWithApplicants,
} = require("../controller/jobs/jobs");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.post("/", protect, postJob);
router.get("/", getAllJobs);
router.get("/myJobs", protect, getMyJobs);
router.post("/:id", protect, applyForJob);
router.get("/myjob/:id", protect, getMyJobWithApplicants);

module.exports = router;
