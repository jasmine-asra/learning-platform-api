import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError";
import { getCourseData } from "../models/courseModel";

/*
    Function to get lifetime stats for a course
    @param courseId: string
    @returns { totalModulesStudied: number, averageScore: number, timeStudied: number }
*/
export const getCourseStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId } = req.params;
      const userId = req.header("userId");
    
      if (!userId || !courseId) {
        throw new ApiError("Missing required fields", 400);
      }
  
      const stats = await getCourseData(userId, courseId);
  
      if (!stats || stats.length === 0) {
        res.status(404).json({ error: "Course not found" });
        return;
      }
  
      const totalModulesStudied = stats.reduce((sum, item) => sum + item.totalModulesStudied, 0);
      const timeStudied = stats.reduce((sum, item) => sum + item.timeStudied, 0);
      const averageScore = stats.reduce((sum, item) => sum + item.averageScore, 0) / stats.length;
  
      res.json({ totalModulesStudied, averageScore, timeStudied });
    } catch (error) {
      next(error);
    }
};