const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// load env
dotenv.config({ path: "./config/config.env" });

// load models
const State = require("./models/state");
const Lga = require("./models/lga");
// connect to db
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// read JSON FILES
const state = JSON.parse(
  fs.readFileSync(`${__dirname}/data/state.json`, "utf-8")
);

const lga = JSON.parse(fs.readFileSync(`${__dirname}/data/lga.json`, "utf-8"));

// import into DB
const importData = async () => {
  try {
    await State.create(state);
    await Lga.create(lga);
    console.log("data Imported...".green.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// delete data

const deleteData = async () => {
  try {
    await State.deleteMany();
    await Lga.deleteMany();
    console.log("data destroyed...".green.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
