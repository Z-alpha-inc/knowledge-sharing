// src/schemas/articleSchema.ts
import { z } from 'zod';

// zodによるバリデーションスキーマを定義
export const ArticleSchema = z.object({
    title: z.string().min(1, 'タイトルは必須です'),
    content: z.string().min(1, '内容は必須です'),
    // 本来は認証システムから取得するが、現状ではデフォルトor従業員に入力させる
    authorId: z.string().min(1, 'ユーザーIDは必須です'), // zodはuuid形式だが、prismaはcuid形式で合わない
    department: z.enum(['sales', 'engineering', 'pr', 'all'], {
        message: '有効な部門を選択してください', // messageオプションでエラーメッセージをカスタマイズ
    }),
    // react-hook-form の useFieldArray は「配列の中の要素がオブジェクトであること」を前提に設計
    // https://react-hook-form.com/docs/usefieldarray
    youtubeLinks: z.array(z.object({
        url: z.url('有効なYouTube URLを入力してください') // オブジェクト配列にしてuseFieldArrayで扱いやすくする
    })).optional(),
    siteLinks: z.array(z.object({
        url: z.url('有効なWebサイト URLを入力してください') // オブジェクト配列にしてuseFieldArrayで扱いやすくする
    })).optional(),
});

// Zodスキーマを変更すると、ArticleFormData型も自動的に更新されるため、型定義の手間を省ける
// inferを使ってArticleSchemaから型を生成
export type ArticleFormData = z.infer<typeof ArticleSchema>;
