import express, { Request, Response, NextFunction } from "express";
import { client } from "src/db";
export const router = express.Router();
// controllers

type handlerFunction<ResponseType> = (
  req?: Request,
  res?: Response,
  next?: NextFunction
) => Promise<ResponseType>;

interface ExpressError extends Error {
  status?: number;
}

// get all tags
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const query = "SELECT tags.* FROM tags";

    const { rows } = await client.query(query);

    // if no rows returned, return what?
    if (rows.length === 0) {
      return res.status(404).send("No tags found");
    }

    return res.json(rows);
  } catch (err) {
    // not actually sure what an error would look like here
    console.log("Error fetching all tags:");
    console.error(err);
    return next(err);
  }
});

// get a specific tag
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = "SELECT tags.* FROM tags WHERE tags.id = $1";
    const { rows } = await client.query(query, [req.params.id]);

    // row is empty, or was returned but it is null or undefined results in error
    if (rows.length === 0 || !rows[0]) {
      const new404: ExpressError = new Error("Tag not found");
      new404.status = 404;
      throw new404;
    }

    return res.json(rows[0]);
  } catch (err) {
    console.log(`Error fetching tag with id ${req.params.id}`);
    console.error(err);
    return next(err);
  }
});

// add a new tag
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // should ideally validate on front end that tagName was sent in the request body, but will do so here as well
    const { tagName } = req.body || {};

    if (!tagName) {
      const tagPostError: ExpressError = new Error(
        "No tag name included in request body"
      );
      tagPostError.status = 404;
      throw tagPostError;
    }

    const query = "INSERT INTO tags (tag_name) VALUES ($1) RETURNING *";

    // probably safe not to check for existence of rows, or row[0] if the query succeeds? Assume if query succeeds, then
    // there will be tag data returned
    const { rows } = await client.query(query, [tagName]);

    res.status(201).send(rows[0]);
  } catch (err) {
    console.log(`Failed to add new tag`);
    console.error(err);
    return next(err);
  }
});
