const express = require("express");
const {
  updateProfile,
  updateUser,
  uploadPortfolioImage,
} = require("../controller/user/user");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.put("/:id", protect, updateUser);
router.put("/", protect, updateProfile);
router.post("/portfolioImages", protect, uploadPortfolioImage);

module.exports = router;
