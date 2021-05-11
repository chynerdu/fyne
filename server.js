const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
app.use(cors());
app.options("*", cors());
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

// websocket
const WebSocket = require("ws");

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("web socket connected ", wss.clients);
  ws.on("message", (message) => {
    console.log(`Received message => ${message}`);
  });
  ws.send("ho!");
});

const morgan = require("morgan");
const errorHandler = require("./middleware/error");
const colors = require("colors");
const connectDB = require("./config/db");

// route files
const auth = require("./routes/auth");
const user = require("./routes/user");
const metaData = require("./routes/metaData");
const job = require("./routes/jobs");
const jobsContd = require("./routes/jobs_contd");

// load env
dotenv.config({ path: "./config/config.env" });

// connect to database
connectDB();

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
app.use("/api/v1/job", job);
app.use("/api/v1/applicants", jobsContd);
app.use(errorHandler);

// ///////   Socket Connection ///////////////////
io.on("connection", (socket) => {
  console.log("Some client connected");
  socket.on("joinPublic", (message) => {
    console.log("joining public: ", message);
    io.emit("adminMessage", "welcome to public room");
    io.emit("roomData", "room Data");
  });

  // private chat test
  socket.on("JoinPrivate", (message) => {
    console.log("joining private: ", message);
    io.emit("adminMessage", "welcome to private room");
    io.emit("roomData", "room Data");
  });
  //  chat message
  socket.on("chat-message", (message) => {
    console.log("new message: ", message);
    io.emit("adminMessage", message);
    // io.emit("roomData", "room Data");
  });
});

const PORT = process.env.PORT || 4500;

// const server = app.listen(
//   PORT,
//   console.log(
//     `server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
//   )
// );

server.listen(
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
