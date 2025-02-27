import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import logger from "./middlewares/logger";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
const router = express.Router();

app.use("/courses", router);

// Health Check
app.get("/", (req, res) => {
  res.send("API is running!");
});

export default app;
