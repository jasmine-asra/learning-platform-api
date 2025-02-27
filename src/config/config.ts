import dotenv from "dotenv";

dotenv.config();

const useLocalDynamoDB = process.env.USE_LOCAL_DYNAMODB === "true";

export default {
  port: process.env.PORT || 3000,
  dynamoDBTable: process.env.STATS_TABLE || "StatsTable",
  useLocalDynamoDB,
};
