// src/lib/articles.ts
import { ArticleFormData } from '@/schemas/articleSchema';

// API呼び出し(全記事を取得)関数を分離
export async function createArticle(data: ArticleFormData) {
  const filteredData = {
    ...data,
    youtubeLinks: data.youtubeLinks
      ?.map(link => link.url?.trim())
      .filter(url => url !== ''),
    siteLinks: data.siteLinks
      ?.map(link => link.url?.trim())
      .filter(url => url !== ''),
  };

  const response = await fetch('/api/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filteredData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '記事の投稿に失敗しました');
  }

  return response.json();
}