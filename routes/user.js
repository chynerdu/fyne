const express = require("express");
const { updateProfile, updateUser } = require("../controller/user/user");

const {
  uploadPortfolioImage,
  getLoggedInUserPortfolio,
  getUsersPortfolio,
} = require("../controller/portfolio/portfolio");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.put("/:id", protect, updateUser);
router.put("/", protect, updateProfile);
router.post("/portfolioImages", protect, uploadPortfolioImage);
router.get("/portfolioImages", protect, getLoggedInUserPortfolio);
router.get("/userPortfolioImages/:id", protect, getUsersPortfolio);

module.exports = router;
