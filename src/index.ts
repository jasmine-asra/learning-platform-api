import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import logger from "./middlewares/logger";
import { createSession, getSessionStats } from "./controllers/sessionController";
import { getCourseStats } from "./controllers/courseController";
import errorHandler from "./middlewares/errorHandler";
import ApiError from "./utils/apiError";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
const router = express.Router();

router.post("/:courseId/sessions", createSession);
router.get("/:courseId/sessions/:sessionId", getSessionStats);
router.get("/:courseId/stats", getCourseStats);

app.use("/courses", router);

// Health Check
app.get("/", (req, res) => {
  res.send("API is running!");
});

// Error Handling
app.use((req, res, next) => {
  const error = new ApiError('Not Found', 404);
  next(error);
});
app.use(errorHandler);

export default app;
