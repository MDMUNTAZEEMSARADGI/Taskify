import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  createTask,
  deletTask,
  getTasks,
  getTasksById,
  updateTask,
} from "../controllers/taskControllers.js";
const taskRoute = express.Router();

taskRoute
  .route("/gp")
  .get(authMiddleware, getTasks)
  .post(authMiddleware, createTask);

taskRoute
  .route("/:id/gp")
  .get(authMiddleware, getTasksById)
  .put(authMiddleware, updateTask)
  .delete(authMiddleware, deletTask);

export default taskRoute;
    