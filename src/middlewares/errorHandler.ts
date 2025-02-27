import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
};

export default errorHandler;