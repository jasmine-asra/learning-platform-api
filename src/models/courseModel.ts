import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import config from "../config/config";
import dynamoDB from "../config/dynamo";

const TABLE_NAME = config.dynamoDBTable;

export const getCourseData = async (userId: string, courseId: string) => {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: "userId = :userId",
    FilterExpression: "courseId = :courseId", // Get user's stats for a specific course
    ExpressionAttributeValues: {
      ":userId": userId,
      ":courseId": courseId,
    },
  });

  const result = await dynamoDB.send(command);
  return result.Items || [];
};