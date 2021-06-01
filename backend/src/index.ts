import express from "express";
const app = express();
const PORT = 8080;

// figure out why I need to add a "_" to unused variables even when "noUnusedLocals" in tsconfig is set to false
app.get("/", (_req, res, _next) => {
  return res.send("Hello from express!");
});

app.listen(PORT, function appListener() {
  console.log("server is running on port ", PORT);
});
