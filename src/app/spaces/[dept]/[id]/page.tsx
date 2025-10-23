// app/spaces/[dept]/[id]/page.tsx
import { notFound } from 'next/navigation';
import { getAnArticleFromDb } from '@/lib/data';
import { ArticleDetailView } from './components/ArticleDetailView';

export default async function ArticleDetailPage( {
    params 
}: { 
  params: Promise<{ dept: string, id: string }> // 動的URLなのでPromiseを追加
}) {
  const { id } = await params;

  // APIルートから記事を取得
  // DBから直接記事を取得
  const article = await getAnArticleFromDb(id);

  // 記事が見つからなかった場合 (getAnArticleFromDb が null を返した場合)
  if (!article) {
    notFound();
  }

  return <ArticleDetailView article={article} />;
}