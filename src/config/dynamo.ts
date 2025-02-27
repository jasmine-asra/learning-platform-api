import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import config from "./config";

const client = new DynamoDBClient({
  region: "us-east-1",
  endpoint: config.useLocalDynamoDB ? "http://localhost:8000" : undefined,
});

const dynamoDB = DynamoDBDocumentClient.from(client);

export default dynamoDB;