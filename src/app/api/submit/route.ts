import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

// DynamoDBクライアントの初期化（ハンドラ外で再利用可能）
const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

// POSTメソッドのみを許可する型定義
export async function POST(request: Request) {
  try {
    // リクエストボディのバリデーション
    const body = await request.json();
    
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return Response.json(
        { error: 'リクエストボディは有効なJSONオブジェクトである必要があります' },
        { status: 400 }
      );
    }

    // すべての値が文字列であることを確認
    const isValidBody = Object.values(body).every(value => typeof value === 'string');
    if (!isValidBody) {
      return Response.json(
        { error: 'すべての値は文字列である必要があります' },
        { status: 400 }
      );
    }

    // ISO 8601形式のタイムスタンプを追加
    const item = {
      ...body,
      createdAt: new Date().toISOString(),
    };

    // DynamoDBへの登録処理
    await docClient.send(new PutCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: item,
    }));

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('DynamoDBへの登録中にエラーが発生しました:', error);
    return Response.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

// その他のHTTPメソッドに対して405を返す
export async function GET() {
  return methodNotAllowed();
}

export async function PUT() {
  return methodNotAllowed();
}

export async function DELETE() {
  return methodNotAllowed();
}

export async function PATCH() {
  return methodNotAllowed();
}

function methodNotAllowed() {
  return Response.json(
    { error: 'Method Not Allowed' },
    { status: 405 }
  );
}
