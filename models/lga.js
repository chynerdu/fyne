const mongoose = require("mongoose");

const LgaSchema = new mongoose.Schema({
  lga_label: {
    type: String,
    required: [true, "Please enter lga"],
  },
  state_id: {
    type: String,
    required: [true, "Please enter state id"],
  },
});

module.exports = mongoose.model("Lga", LgaSchema);
