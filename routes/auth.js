const express = require("express");
const { register, login, getMe } = require("../controller/auth/auth");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/getMe", protect, getMe);

module.exports = router;
