const express = require("express");
const { updateProfile } = require("../controller/user/user");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.post("/:id", protect, updateProfile);

module.exports = router;
