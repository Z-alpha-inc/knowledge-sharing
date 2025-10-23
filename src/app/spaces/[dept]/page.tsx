// server component app/spaces/[dept]/page.tsx
import { ArticleListClient } from './components/ArticleListClient';
import { Article } from '@/types';
import { prisma } from '@/lib/prisma';

// APIのGETルートにあったDB取得処理をここに移動
export async function getArticlesFromDb(dept: string): Promise<Article[]> {
  console.log(`[DB Direct] Fetching articles for dept: ${dept}`);

  try {
    // データベース接続（すでにあるprisma.tsで$connectされていれば不要かも）
    const articlesFromDb = await prisma.article.findMany({
      where: dept ? { department: dept } : undefined,
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`[DB Direct] Found ${articlesFromDb.length} articles`);

    // Dateをstringに変換（シリアライズ）する
    // Prismaから返る "Date" 型を、Article型の "string" 型に合わせる
    const articles: Article[] = articlesFromDb.map(article => ({
      ...article,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
    }));

    console.log(`[DB Direct] Found ${articles.length} articles`);
    return articles; // 取得したデータをそのまま返す

  } catch (error) {
    console.error('[DB Direct] Error fetching articles:', error);
    return []; // エラー時は空配列を返す
  }
}

// ページのメインコンポーネント
export default async function SpacePage({
  params
}: {
  params: Promise<{ dept: string }> // 動的URLなのでPromiseを追加
}) {
  // ★ 最初にparamsをawaitで解決する
  const { dept } = await params;
  // サーバーサイドでURLパラメータに基づいて記事データを取得
  const initialArticles = await getArticlesFromDb(dept);

  // 取得したデータをClient Componentにpropsとして渡す
  return (
    <ArticleListClient
      initialArticles={initialArticles}
      currentDept={dept}
    />
  );
}
