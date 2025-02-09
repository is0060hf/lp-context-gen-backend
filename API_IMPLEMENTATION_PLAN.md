# Form Submission API Implementation Plan

## 1. File Structure
```
pages/api/submit.ts  // API endpoint implementation
lib/
  ├── dynamodb.ts    // DynamoDB client configuration
  ├── schema.ts      // Zod validation schemas
  └── types.ts       // TypeScript type definitions
```

## 2. Validation Schema (schema.ts)
- Create Zod schema for request body validation:
  ```typescript
  const formSchema = z.object({
    name: z.string().min(1, "名前は必須です"),
    email: z.string().email("有効なメールアドレスを入力してください"),
    message: z.string().min(1, "メッセージは必須です")
  });
  ```

## 3. DynamoDB Client Configuration (dynamodb.ts)
- Initialize DynamoDB client outside handler:
  ```typescript
  import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
  import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

  const client = new DynamoDBClient({
    region: process.env.AWS_REGION
  });
  export const docClient = DynamoDBDocumentClient.from(client);
  ```

## 4. API Route Implementation (submit.ts)
1. HTTP Method Validation
   - Check if method is POST
   - Return 405 for non-POST requests

2. Request Body Validation
   - Parse JSON body
   - Validate against Zod schema
   - Return 400 with validation errors if invalid

3. DynamoDB Integration
   - Create item with form data and ISO 8601 timestamp
   - Use PutCommand from DynamoDBDocumentClient
   - Use environment variables for configuration

4. Error Handling
   - Try/catch block around DynamoDB operations
   - Return 500 for DynamoDB errors
   - Log errors appropriately

## 5. Environment Variables
Required variables:
- DYNAMODB_TABLE_NAME: DynamoDB table name
- AWS_REGION: AWS region for DynamoDB client

## 6. Response Format
Success (200):
```json
{
  "success": true,
  "message": "フォームデータが正常に送信されました"
}
```

Error (400/405/500):
```json
{
  "success": false,
  "error": "エラーメッセージ"
}
```

## 7. Testing Plan
1. Validate HTTP method handling
2. Test input validation
3. Verify DynamoDB integration
4. Confirm error handling
5. Check environment variable usage
