import { NextApiRequest, NextApiResponse } from 'next';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from '../../lib/dynamodb';
import { ApiResponse, FormData } from '../../lib/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // HTTP method validation
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    // リクエストボディのバリデーション
    const body = req.body;
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request body format'
      });
    }

    // すべての値が文字列であることを確認
    const isValid = Object.entries(body).every(([_, value]) => typeof value === 'string');
    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: 'All values must be strings'
      });
    }

    const formData: FormData = body;

    // Prepare DynamoDB item
    const item = {
      ...formData,
      createdAt: new Date().toISOString()
    };

    // Save to DynamoDB
    await docClient.send(
      new PutCommand({
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Item: item
      })
    );

    return res.status(200).json({
      success: true,
      message: 'フォームデータが正常に送信されました'
    });

  } catch (error) {
    // Log error for debugging
    console.error('Error processing form submission:', error);

    return res.status(500).json({
      success: false,
      error: 'サーバーエラーが発生しました'
    });
  }
}
