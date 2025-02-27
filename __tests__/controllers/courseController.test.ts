import { mockSend, mockRequest, mockResponse } from '../testSetup';
import { getCourseStats } from '../../src/controllers/courseController';
import errorHandler from '../../src/middlewares/errorHandler';
import * as dynamoDBLib from '@aws-sdk/lib-dynamodb';


describe('Course Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockSend.mockReset();
    });
    
    describe('GET /courses/:courseId', () => {
        test('should fetch and aggregate lifetime stats for a course', async () => {
            const req = mockRequest();
            const res = mockResponse();
            
            req.params.courseId = 'course-123';
            req.header = jest.fn().mockReturnValue('user-123');
            
            const mockItems = [
                {
                userId: 'user-123',
                courseId: 'course-123',
                sessionId: 'session-1',
                totalModulesStudied: 10,
                averageScore: 80,
                timeStudied: 60
                },
                {
                userId: 'user-123',
                courseId: 'course-123',
                sessionId: 'session-2',
                totalModulesStudied: 15,
                averageScore: 90,
                timeStudied: 75
                }
            ];
            
            mockSend.mockResolvedValueOnce({ Items: mockItems });

            await getCourseStats(req, res, jest.fn());

            expect(req.header).toHaveBeenCalledWith('userId');
            expect(dynamoDBLib.QueryCommand).toHaveBeenCalledWith({
                TableName: expect.any(String),
                KeyConditionExpression: 'userId = :userId',
                FilterExpression: 'courseId = :courseId',
                ExpressionAttributeValues: {
                ':userId': 'user-123',
                ':courseId': 'course-123'
                }
            });
            expect(res.json).toHaveBeenCalledWith({
                totalModulesStudied: 25,
                averageScore: 85,
                timeStudied: 135
            });
        });

        test('should return 404 if course is not found', async () => {
            const req = mockRequest();
            const res = mockResponse();
            
            req.params.courseId = 'course-123';
            req.header = jest.fn().mockReturnValue('user-123');
            
            mockSend.mockResolvedValueOnce({ Items: [] });

            await getCourseStats(req, res, jest.fn());

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Course not found'
            });
        });

        test('should return 400 if required fields are missing', async () => {
            const req = mockRequest();
            const res = mockResponse();
            
            req.params.courseId = 'course-123';
            // Missing userId header

            const next = jest.fn();

            await getCourseStats(req, res, next);

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
            req.header = jest.fn().mockReturnValue('user-123');

            mockSend.mockRejectedValueOnce(new Error('DynamoDB error'));

            const next = (error: any) => {
                errorHandler(error, req, res, jest.fn());
            };

            await getCourseStats(req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
        });
    });
});