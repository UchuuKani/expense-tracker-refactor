import express from "express";
export const router = express.Router();
import { router as usersRouter } from "./users";
import { router as tagsRouter } from "./tags";
import { router as transactionsRouter } from "./transactions";

router.use("/users", usersRouter);
router.use("/tags", tagsRouter);
router.use("/transactions", transactionsRouter);
