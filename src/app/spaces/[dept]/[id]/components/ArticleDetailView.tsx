'use client';

import { useState } from 'react'; // 👈 Import useState
import { Article } from '@/types';
import { Card } from '@/components/ui/card';
import MDEditor from '@uiw/react-md-editor';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { YouTubeCard } from '@/app/spaces/components/youtubeEmbed';
import { LinkPreviewCard } from '@/app/spaces/components/linkPreviewCard';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Play, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button'; // 👈 Import Button for consistency

type ArticleDetailViewProps = {
    article: Article;
};

export function ArticleDetailView({ article }: ArticleDetailViewProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false); // 👈 Add deleting state

    const handleBack = () => {
        router.back();
    };

    const getInitial = (name: string) => {
        return name.slice(0, 1).toUpperCase();
    };

    const getDepartmentName = (dept: string) => {
        const deptMap: Record<string, string> = {
            sales: '営業部',
            engineering: '開発部',
            pr: '広報部',
            all: '全社共有',
        };
        return deptMap[dept] || dept;
    }

    const handleDelete = async () => {
        if (!window.confirm(`記事「${article.title}」を本当に削除しますか？`)) {
            return;
        }

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/articles/${article.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('記事の削除に失敗しました');
            }

            alert('記事を削除しました。');
            router.push(`/spaces/${article.department}`);
            router.refresh();

        } catch (error) {
            console.error('削除エラー:', error);
            alert('記事の削除に失敗しました。');
            setIsDeleting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* ヘッダー */}
            <div className="mb-6 flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition px-2 py-1 h-auto" // Adjust padding/height
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>戻る</span>
                </Button>

                {/* アクションボタン（編集・削除） */}
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50">
                        <Edit className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:bg-red-50"
                        onClick={handleDelete}
                        disabled={isDeleting}  // 削除処理中にボタンを連打を防ぐ状態管理
                    >
                        {isDeleting ? (
                            <span className="animate-spin h-5 w-5 border-2 border-red-600 border-t-transparent rounded-full"></span>
                        ) : (
                            <Trash2 className="w-5 h-5" />
                        )}
                    </Button>
                </div>
            </div>

            {/* メインカード */}
            <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarFallback className="bg-orange-500 text-white">
                            {getInitial(article.author.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium text-gray-900">{article.author.name}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-0.5">
                            <span>
                                作成日:
                                <span className="ml-1">{new Date(article.createdAt).toLocaleDateString('ja-JP')}</span>
                            </span>
                            <span>
                                最終更新日:
                                <span className="ml-1">{new Date(article.updatedAt).toLocaleDateString('ja-JP')}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* タイトル */}
                <div className="flex items-center gap-3 mb-2 mt-4">
                    <h1 className="text-4xl font-bold text-gray-900">
                        {article.title}
                    </h1>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        {getDepartmentName(article.department)}
                    </span>
                </div>

                {/* 本文 */}
                <div data-color-mode="light" className="max-w-none mb-8">
                    <MDEditor.Markdown
                        source={article.content}
                        style={{
                            backgroundColor: 'transparent',
                            fontSize: '16px',
                            lineHeight: '1.8',
                        }}
                    />
                </div>

                {/* YouTubeリンク */}
                {article.youtubeLinks?.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Play className="w-5 h-5 text-red-600" />
                            YouTube
                        </h2>
                        <div className="space-y-4">
                            {article.youtubeLinks.map((link) => (
                                <YouTubeCard key={link} url={link} />
                            ))}
                        </div>
                    </div>
                )}

                {/* サイトリンク */}
                {article.siteLinks?.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-blue-600" />
                            Webサイト
                        </h2>
                        <div className="space-y-4">
                            {article.siteLinks.map((link) => (
                                <LinkPreviewCard key={link} url={link} />
                            ))}
                        </div>
                    </div>
                )}

            </Card>
        </div>
    );
}
