import express, { Request, Response, NextFunction } from "express";
const cors = require("cors");
const app = express();
const PORT = 8080;

app.use(cors({ origin: "http://localhost:3000" }));

// figure out why I need to add a "_" to unused variables even when "noUnusedLocals" in tsconfig is set to false
// 11/28/2021 - realize the type errors are popping up because of the "noUnusedParameters" option in tsconfig. Can append a "_" to get around this, or
// turn off the rule - for now will use the "_" approach
app.get("/", (_req: Request, res: Response, _next: NextFunction) => {
  return res.json("hi");
});

app.listen(PORT, function appListener() {
  console.log("server is running on port ", PORT);
});
