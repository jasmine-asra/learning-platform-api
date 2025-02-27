import { CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import config from "./config";

const client = new DynamoDBClient({
  region: "us-east-1",
  endpoint: config.useLocalDynamoDB ? "http://localhost:8000" : undefined,
});

const createTable = async () => {
  const command = new CreateTableCommand({
    TableName: config.dynamoDBTable,
    KeySchema: [
      { AttributeName: "userId", KeyType: "HASH" }, // Partition Key
      { AttributeName: "sessionId", KeyType: "RANGE" } // Sort Key
    ],
    AttributeDefinitions: [
      { AttributeName: "userId", AttributeType: "S" },
      { AttributeName: "sessionId", AttributeType: "S" }
    ],
    BillingMode: "PAY_PER_REQUEST",
  });

  try {
    const result = await client.send(command);
    console.log("Table created successfully", result);
  } catch (error) {
    console.error("Error creating table", error);
  }
};

createTable();