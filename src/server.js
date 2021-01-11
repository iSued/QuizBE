const express = require("express");
const cors = require("cors");
const listEndpoints = require("express-list-endpoints");

const {
  notFoundHandler,
  unauthorizedHandler,
  forbiddenHandler,
  badRequestHandler,
  catchAllHandler,
} = require("./errorHandlers");

const ExamRouter = require("./services/quiz");
const server = express();
server.use(cors());
server.use(express.json());

server.use("/exam", ExamRouter);

const port = 3001;

console.log(listEndpoints(server));

server.use(notFoundHandler);
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(badRequestHandler);
server.use(catchAllHandler);

console.log(listEndpoints(server));

server.listen(port, () => console.log("Server is running on port: " + port));
