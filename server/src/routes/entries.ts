import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  createEntry,
  deleteEntry,
  listEntries,
  updateEntry,
  updateRanks,
} from "../controllers/entriesController.js";

export const entriesRouter = Router();

entriesRouter.use(authMiddleware);
entriesRouter.get("/", listEntries);
entriesRouter.post("/", createEntry);
entriesRouter.put("/ranks", updateRanks);
entriesRouter.put("/:id", updateEntry);
entriesRouter.delete("/:id", deleteEntry);
