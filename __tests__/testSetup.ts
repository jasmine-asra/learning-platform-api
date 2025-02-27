// Mock the DynamoDB client send method
export const mockSend = jest.fn();

// Replace the DynamoDB client with a mock
jest.mock('../src/config/dynamo', () => ({
  __esModule: true,
  default: { send: mockSend },
}));

beforeAll(() => {
  process.env.STATS_TABLE = 'TestTable';

  // Ensure TestTable is used for all tests
  jest.resetModules();
  jest.doMock("../src/config/config", () => ({
    __esModule: true,
    default: {
      ...jest.requireActual("../src/config/config"),
      dynamoDBTable: "TestTable",
    },
  }));
});

import { Request, Response } from 'express';

// Mock the AWS SDK client
jest.mock('@aws-sdk/lib-dynamodb', () => ({
  PutCommand: jest.fn().mockImplementation(() => ({})),
  QueryCommand: jest.fn().mockImplementation(() => ({})),
}));

// Mock the UUID library
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('generated-uuid'),
}));

// Mock Express request and response
export const mockRequest = (): Request => {
  const req: Partial<Request> = {};
  req.params = {};
  req.body = {};
  req.header = jest.fn();
  return req as Request;
};

export const mockResponse = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res as Response;
};
