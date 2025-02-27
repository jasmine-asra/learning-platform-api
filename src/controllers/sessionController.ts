import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import ApiError from "../utils/apiError";
import { saveSessionData, getSessionData } from "../models/sessionModel";

/*
  Function to save session stats
  @param courseId: string
  @param sessionId: string
  @param totalModulesStudied: number
  @param averageScore: number
  @param timeStudied: number
  @returns { message: string, sessionId: string }
*/
export const createSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const { sessionId = uuidv4(), totalModulesStudied, averageScore, timeStudied } = req.body;
    const userId = req.header("userId");

    if (!userId || !courseId || !totalModulesStudied || !averageScore || !timeStudied) {
      throw new ApiError("Missing required fields", 400);
    }

    const item = { userId, courseId, sessionId, totalModulesStudied, averageScore, timeStudied };

    await saveSessionData(item);
    res.status(201).json({ message: "Session stats saved successfully", sessionId });

  } catch (error) {
    next(error);
  }
};

/*
  Function to get session stats for a course
  @param courseId: string
  @param sessionId: string
  @returns { sessionId: string, totalModulesStudied: number, averageScore: number, timeStudied: number }
*/
export const getSessionStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId, sessionId } = req.params;
    const userId = req.header("userId");
    
    if (!userId || !courseId || !sessionId) {
      throw new ApiError("Missing required fields", 400);
    }
  
    const sessionData = await getSessionData(userId, courseId, sessionId);
    
    if (!sessionData || sessionData.length === 0) {
      throw new ApiError("Session not found", 404);
    }

    const sessionStats = sessionData[0];
    
    res.json({
      sessionId: sessionStats.sessionId,
      totalModulesStudied: sessionStats.totalModulesStudied,
      averageScore: sessionStats.averageScore,
      timeStudied: sessionStats.timeStudied
    });
  } catch (error) {
    next(error);
  }
};