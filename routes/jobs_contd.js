const express = require("express");
const { shortListApplicant } = require("../controller/jobs/jobs_contd");

const router = express.Router();

const { protect } = require("../middleware/auth");
const { checkApplicant } = require("../middleware/applicantIdCheck");

router.post("/shortlist/:id", protect, checkApplicant, shortListApplicant);

module.exports = router;
