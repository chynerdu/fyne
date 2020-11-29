const express = require("express");
const { getMetaData, getLGA } = require("../controller/metaData/meta_data");

const router = express.Router();

// const { protect } = require("../middleware/auth");

router.get("/", getMetaData);

router.get("/lga/:id", getLGA);

module.exports = router;
