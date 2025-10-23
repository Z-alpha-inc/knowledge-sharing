// server component app/spaces/[dept]/page.tsx
import { ArticleListClient } from './components/ArticleListClient';
import { Article } from '@/types';

// APIから記事を取得する関数（エラーハンドリングを含む）
async function getArticlesByDept(dept: string): Promise<Article[]> {
  try {
    // APIエンドポイントのURLを絶対パスで指定することが必須(サーバーコンポーネントの中である場合)
    const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/articles?dept=${dept}`, {
      cache: 'no-store', // 常に最新のデータを取得
    });

    if (!response.ok) {
      console.error('Failed to fetch articles:', await response.text());
      return []; // エラー時は空の配列を返す
    }
    return response.json();
  } catch (error) {
    console.error('An error occurred while fetching articles:', error);
    return [];
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
  const initialArticles = await getArticlesByDept(dept);

  // 取得したデータをClient Componentにpropsとして渡す
  return (
    <ArticleListClient
      initialArticles={initialArticles}
      currentDept={dept}
    />
  );
}
