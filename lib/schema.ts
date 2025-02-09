import { z } from 'zod';

export const formSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  message: z.string().min(1, "メッセージは必須です")
});

export type FormSchema = z.infer<typeof formSchema>;
