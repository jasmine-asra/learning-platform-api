import request from 'supertest';
import app from '../src/index';
import * as sessionController from '../src/controllers/sessionController';
import * as courseController from '../src/controllers/courseController';

jest.mock('../src/controllers/sessionController');
jest.mock('../src/controllers/courseController');

describe('API Routes', () => {
  it('should return API is running on GET /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('API is running!');
  });

  it('should access POST /courses/:courseId', async () => {
    const mockCreateSession = jest.spyOn(sessionController, 'createSession').mockImplementation(async (req, res, next) => {
      res.status(201).send();
    });

    const response = await request(app)
      .post('/courses/1')
      .send({ 
        totalModulesStudied: 1,
        timeStudied: 15,
        averageScore: 70
      });

    expect(response.status).toBe(201);
    expect(mockCreateSession).toHaveBeenCalled();
  });

  it('should access GET /courses/:courseId', async () => {
    const mockGetCourseStats = jest.spyOn(courseController, 'getCourseStats').mockImplementation(async (req, res, next) => {
      res.status(200).send();
    });

    const response = await request(app).get('/courses/1');
    expect(response.status).toBe(200);
    expect(mockGetCourseStats).toHaveBeenCalled();
  });

  it('should access GET /courses/:courseId/sessions/:sessionId', async () => {
    const mockGetSessionStats = jest.spyOn(sessionController, 'getSessionStats').mockImplementation(async (req, res, next) => {
      res.status(200).send();
    });

    const response = await request(app).get('/courses/1/sessions/1');
    expect(response.status).toBe(200);
    expect(mockGetSessionStats).toHaveBeenCalled();
  });

  it('should return 404 for unknown routes', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.status).toBe(404);
  });
});