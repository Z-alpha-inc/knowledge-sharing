// src/schemas/articleSchema.ts
import { z } from 'zod';

// zodによるバリデーションスキーマを定義
export const ArticleSchema = z.object({
    title: z.string().min(1, 'タイトルは必須です'),
    content: z.string().min(1, '内容は必須です'),
    // 本来は認証システムから取得するが、現状ではデフォルトor従業員に入力させる
    authorId: z.uuid('有効なユーザーIDを入力してください'), // UUID形式を想定
    department: z.enum(['sales', 'engineering', 'pr', 'all'], {
        message: '有効な部門を選択してください', // messageオプションでエラーメッセージをカスタマイズ
    }),
    youtubeLinks: z.array(
        z.url('有効なYouTube URLを入力してください') // z.string().url()は新バージョンでは非推奨
        .optional()
        .or(z.literal('')) // 空文字列も許容
    ).optional(),
    siteLinks: z.array(
        z.url('有効なWebサイト URLを入力してください') // z.string().url()は新バージョンでは非推奨
        .optional()
        .or(z.literal('')) // 空文字列も許容
    ).optional(),
});

// Zodスキーマを変更すると、ArticleFormData型も自動的に更新されるため、型定義の手間を省ける
// inferを使ってArticleSchemaから型を生成
export type ArticleFormData = z.infer<typeof ArticleSchema>;
