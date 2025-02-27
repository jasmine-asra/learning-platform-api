import { mockSend, mockRequest, mockResponse } from '../testSetup';
import { createSession, getSessionStats } from '../../src/controllers/sessionController';
import errorHandler from '../../src/middlewares/errorHandler';
import * as dynamoDBLib from '@aws-sdk/lib-dynamodb';


describe('Session controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSend.mockReset();
  });

  describe('Save session stats controller', () => {
    test('should save session stats successfully', async () => {
      const req = mockRequest();
      const res = mockResponse();
      
      req.params.courseId = 'course-123';
      req.body = {
        sessionId: 'session-123',
        totalModulesStudied: 10,
        averageScore: 85,
        timeStudied: 60
      };
      req.header = jest.fn().mockReturnValue('user-123');
      
      mockSend.mockResolvedValueOnce({});

      await createSession(req, res, jest.fn());

      expect(req.header).toHaveBeenCalledWith('userId');
      expect(dynamoDBLib.PutCommand).toHaveBeenCalledWith({
        TableName: expect.any(String),
        Item: {
          userId: 'user-123',
          courseId: 'course-123',
          sessionId: 'session-123',
          totalModulesStudied: 10,
          averageScore: 85,
          timeStudied: 60
        }
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Session stats saved successfully',
        sessionId: 'session-123'
      });
    });

    test('should generate sessionId if not provided', async () => {
      const req = mockRequest();
      const res = mockResponse();
      
      req.params.courseId = 'course-123';
      req.body = {
        totalModulesStudied: 10,
        averageScore: 85,
        timeStudied: 60
      };
      req.header = jest.fn().mockReturnValue('user-123');
      
      mockSend.mockResolvedValueOnce({});
      
      jest.mock('uuid', () => ({ // Mock the UUID library
        v4: jest.fn().mockReturnValue('generated-uuid')
      }));

      await createSession(req, res, jest.fn());

      expect(dynamoDBLib.PutCommand).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('should return 400 if required fields are missing', async () => {
      const req = mockRequest();
      const res = mockResponse();
      
      req.params.courseId = 'course-123';
      req.body = {
        sessionId: 'session-123',
        // Missing fields
      };
      req.header = jest.fn().mockReturnValue('user-123');

      const next = jest.fn(); // Mock the next function

      await createSession(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 400,
        message: 'Missing required fields'
      }));

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    test('should return 500 if an unexpected error occurs', async () => {
      const req = mockRequest();
      const res = mockResponse();
      
      req.params.courseId = 'course-123';
      req.body = {
        sessionId: 'session-123',
        totalModulesStudied: 10,
        averageScore: 85,
        timeStudied: 60
      };
      req.header = jest.fn().mockReturnValue('user-123');

      mockSend.mockRejectedValueOnce(new Error('DynamoDB error'));

      const next = (error: any) => { // Mock the next function to call the error handler
        errorHandler(error, req, res, jest.fn());
      };

      await createSession(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
    
  });

  describe('Get session stats controller', () => {
    test('should fetch stats for a specific session', async () => {
      const req = mockRequest();
      const res = mockResponse();
      
      req.params.courseId = 'course-123';
      req.params.sessionId = 'session-123';
      req.header = jest.fn().mockReturnValue('user-123');
      
      const mockItems = [
        {
          userId: 'user-123',
          courseId: 'course-123',
          sessionId: 'session-123',
          totalModulesStudied: 10,
          averageScore: 85,
          timeStudied: 60
        }
      ];
      
      mockSend.mockResolvedValueOnce({ Items: mockItems });

      await getSessionStats(req, res, jest.fn());

      expect(req.header).toHaveBeenCalledWith('userId');
      expect(dynamoDBLib.QueryCommand).toHaveBeenCalledWith({
        TableName: expect.any(String),
        KeyConditionExpression: 'userId = :userId AND sessionId = :sessionId',
        FilterExpression: 'courseId = :courseId',
        ExpressionAttributeValues: {
          ':userId': 'user-123',
          ':courseId': 'course-123',
          ':sessionId': 'session-123'
        }
      });
      expect(res.json).toHaveBeenCalledWith({
        sessionId: 'session-123',
        totalModulesStudied: 10,
        averageScore: 85,
        timeStudied: 60
      });
    });

    test('should return 404 if session is not found', async () => {
      const req = mockRequest();
      const res = mockResponse();
      
      req.params.courseId = 'course-123';
      req.params.sessionId = 'session-123';
      req.header = jest.fn().mockReturnValue('user-123');
      
      mockSend.mockResolvedValueOnce({ Items: [] });

      const next = jest.fn();

      await getSessionStats(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 404,
        message: 'Session not found'
      }));

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    test('should return 400 if required fields are missing', async () => {
      const req = mockRequest();
      const res = mockResponse();
      
      req.params.courseId = 'course-123';
      // Missing sessionId and userId

      const next = jest.fn();

      await getSessionStats(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 400,
        message: 'Missing required fields'
      }));

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    test('should return 500 if database operation fails', async () => {
      const req = mockRequest();
      const res = mockResponse();
      
      req.params.courseId = 'course-123';
      req.params.sessionId = 'session-123';
      req.header = jest.fn().mockReturnValue('user-123');
      
      mockSend.mockRejectedValueOnce(new Error('DynamoDB error'));

      const next = (error: any) => {
        errorHandler(error, req, res, jest.fn());
      };

      await getSessionStats(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });
});