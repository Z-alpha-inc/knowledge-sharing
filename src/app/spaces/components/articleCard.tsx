'use client';
import { Article } from '@/types';
import { Card } from '@/components/ui/card';
import MDEditor from '@uiw/react-md-editor';
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
                <div data-color-mode="light" className="max-w-none text-gray-800">
                    <MDEditor.Markdown
                        source={article.content}
                        style={{
                            backgroundColor: 'transparent', // 背景を親カードと統一で自然に
                        }}
                    />
                </div>
            </div>
        </Card>
    );
}
