const mongoose = require("mongoose");

const StateSchema = new mongoose.Schema({
  state_label: {
    type: String,
    required: [true, "Please select state"],
  },
  state_id: {
    type: Number,
    unique: true,
  },
});

// StateSchema.pre("save", async function (next) {

// });

module.exports = mongoose.model("State", StateSchema);
