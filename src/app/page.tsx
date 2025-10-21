'use client';

import { useState, useEffect } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FileText } from 'lucide-react'; // テキストファイルのようなアイコン

import { Article } from '@/types';
import { ArticleCard } from '@/app/spaces/components/articleCard';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 依存配列が空で初回レンダリング時に記事を取得
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles');
      if (!response.ok) throw new Error('Failed to fetch articles');
      const data = await response.json();
      setArticles(data);
    } catch (err) {
      setError('Failed to load articles');
      console.error(err);
    } finally {
      setLoading(false); // 記事取得がうまくいけば(try部分が完了すれば)、loadingを修了して記事を表示
    }
  };

  const getInitial = (name: string) => {
    return name.slice(0, 1).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">ナレッジ共有</h1>
          <p className="text-sm text-gray-600 mt-1">社内の知見を共有しましょう</p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {articles.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">まだ記事がありません</p>
            </div>
          ) : (
            articles.map((article) => (
              // アバターとカードをflexで横並びにするラッパー
              <div key={article.id} className="flex gap-4">
                {/* アバター (カードの外に移動) 画像もしてないのでAvatarFallbaclで代替コンテンツ(頭文字1文字)を出力*/}
                <Avatar className="w-10 h-10 flex-shrink-0"> 
                  <AvatarFallback className="bg-orange-500 text-white">
                    {getInitial(article.author.name)}
                  </AvatarFallback>
                </Avatar>

                {/* 記事カード */}
                <ArticleCard article={article} />
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
