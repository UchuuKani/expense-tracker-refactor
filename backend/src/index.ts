import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler, // use this to type error handler middleware later
} from "express";
// logging middleware
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const PORT = 8080;
import { router } from "./api";

app.use(cors({ origin: "http://localhost:3000" }));

// needed for parsing json bodies and url encoded params sent by front end?
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// logging middleware
app.use(morgan("dev"));

// figure out why I need to add a "_" to unused variables even when "noUnusedLocals" in tsconfig is set to false
// 11/28/2021 - realize the type errors are popping up because of the "noUnusedParameters" option in tsconfig. Can append a "_" to get around this, or
// turn off the rule - for now will use the "_" approach
app.get("/", (_req: Request, res: Response, _next: NextFunction) => {
  return res.json("hi");
});

// auth route
// app.use("/auth", require("./auth"));

// routes
app.use("/api", router);

// 404 handler
app.use("*", (_req, res, _next) => {
  res.status(404).send("Nothing here");
});

app.use(function errorHandler(
  err: any, // find better type later?
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err.status === 404) {
    console.error(err);

    res.status(404).send("You fugged up my dude: 404");
  } else {
    console.error(err, err.message);
    res.status(500).send("server fugged: 500");
  }
});

app.listen(PORT, function appListener() {
  console.log("server is running on port ", PORT);
});
