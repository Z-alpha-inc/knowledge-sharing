'use client';
import { Article } from '@/types';
import { Card } from '@/components/ui/card';
import { ArticleCardHeader } from '@/app/spaces/components/articleCardHeader';

type ArticleCardProps = {
    article: Article;
};

// 記事カードコンポーネント
export const ArticleCard = ({ article }: ArticleCardProps) => {
    return (
        <Card
            className="p-4 hover:shadow-md transition-shadow cursor-pointer flex-1"
        >                  
            {/* コンテンツ */}
            <div className="flex-1 min-w-0">
            {/* ヘッダー情報 */}
            <ArticleCardHeader
                name={article.author.name}
                createdAt={article.createdAt}
            />

            {/* タイトル */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {article.title}
            </h3>

            {/* 本文プレビュー */}
            <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                {article.content}
            </p>
            </div>
        </Card>
    );
}
