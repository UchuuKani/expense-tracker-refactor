import express from "express";
export const router = express.Router();
// controllers

router.get("/", (_req, res, _next) => {
  res.send("tag router");
});
