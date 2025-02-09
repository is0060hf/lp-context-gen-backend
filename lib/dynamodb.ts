import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Initialize DynamoDB client outside of API handler for better performance
const client = new DynamoDBClient({
  region: process.env.AWS_REGION
});

export const docClient = DynamoDBDocumentClient.from(client);
