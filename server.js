const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const morgan = require("morgan");
const errorHandler = require("./middleware/error");
const colors = require("colors");
const connectDB = require("./config/db");

// route files
const auth = require("./routes/auth");
const user = require("./routes/user");
const metaData = require("./routes/metaData");

// load env
dotenv.config({ path: "./config/config.env" });

// connect to database
connectDB();

const app = express();

app.use(cors());

// body parser
app.use(express.json());

// dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// mount routers
app.use("/api/v1/auth", auth);
app.use("/api/v1/user", user);
app.use("/api/v1/metaData", metaData);
app.use(errorHandler);

const PORT = process.env.PORT || 4500;

const server = app.listen(
  PORT,
  console.log(
    `server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// handle unhandled rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});
