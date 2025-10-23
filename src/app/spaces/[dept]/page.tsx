// server component app/spaces/[dept]/page.tsx
import { ArticleListClient } from './components/ArticleListClient';
import { getArticlesFromDb } from '@/lib/data';

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
