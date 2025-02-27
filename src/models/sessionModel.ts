import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import dynamoDB from "../config/dynamo";
import config from "../config/config";

const TABLE_NAME = config.dynamoDBTable;

export const saveSessionData = async (data: {
  userId: string;
  courseId: string;
  sessionId: string;
  totalModulesStudied: number;
  averageScore: number;
  timeStudied: number;
}) => {
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: data,
  });

  await dynamoDB.send(command);
  return data;
};

export const getSessionData = async (userId: string, courseId: string, sessionId: string) => {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: "userId = :userId AND sessionId = :sessionId",
    FilterExpression: "courseId = :courseId", // Get user's stats for a specific session
    ExpressionAttributeValues: {
      ":userId": userId,
      ":courseId": courseId,
      ":sessionId": sessionId
    }
  })

  const result = await dynamoDB.send(command);
  return result.Items || null;
};