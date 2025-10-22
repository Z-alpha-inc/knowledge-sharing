// app/spaces/[dept]/components/ArticleListClient.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { Article } from '@/types';
import { ArticleCard } from '@/app/spaces/components/articleCard';
import { ArticleFormModal } from '@/app/spaces/components/articleForm';
import { DeptSidebar } from '@/app/spaces/components/DeptSidebar';

interface ArticleListClientProps {
    initialArticles: Article[]; // サーバーから渡される初期データ
    currentDept: string;
}

// サーバーから「準備万端のデータ」を受け取り、それをただ表示するだけになったため、isLoading という状態管理が不要になった
// さらに、データ取得ロジックも不要になったため、useEffectも不要(サーバーで非同期にデータを取得してからレンダリングされるため)
// loading.tsxを用意すれば一応表示させることもできる
export function ArticleListClient({ initialArticles, currentDept }: ArticleListClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const getInitial = (name: string) => {
        return name.slice(0, 1).toUpperCase();
    };

    // 記事が投稿された後の処理
    const handleArticlePosted = () => {
        setIsModalOpen(false); // モーダルを閉じる
        // サーバーコンポーネントのデータを再取得し、ページを更新する
        // クライアント側では差分だけ更新(フルリロード)
        // 状態は保持されたまま（例: モーダルが閉じる or スクロール位置は維持）
        router.refresh();
    }

    const departmentName = (dept: string) => {
        switch (dept) {
            case 'sales': return '営業部';
            case 'engineering': return '開発部';
            case 'pr': return '広報部';
            default: return '全社';
        }
    };

    // useEffectやuseStateによるデータ取得ロジックは不要になります
    return (
        <div className="flex h-screen bg-gray-50">
            {/* サイドバー */}
            <DeptSidebar />

            {/* メインコンテンツエリア */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* ヘッダー */}
                <header className="bg-white border-b border-gray-200 flex-shrink-0">
                    <div className="px-6 py-4 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                #{departmentName(currentDept)}
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                {departmentName(currentDept)}向け情報共有スペース
                            </p>
                        </div>

                        <Button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                        >
                            <Plus className="w-5 h-5" />
                            <span>投稿</span>
                        </Button>
                    </div>
                </header>

                {/* スクロール可能なメインコンテンツ */}
                {/*overflow-y-autoによりmainタグ領域は収まり切らないときはスクロールバーが表示される */}
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-6xl mx-auto px-6 py-6">
                        <div className="space-y-4">
                            {initialArticles.length === 0 ? (
                                <div className="text-center py-12">
                                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">この部門にはまだ記事がありません</p>
                                </div>
                            ) : (
                                // アバターとカードをflexで横並びにするラッパー
                                // アバター (カードの外に移動) 画像もしてないのでAvatarFallbackで代替コンテンツ(頭文字1文字)を出力
                                initialArticles.map((article) => (
                                    <div key={article.id} className="flex gap-4">
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
                    </div>
                </main>
            </div>

            {/* モーダル */}
            <ArticleFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onArticlePosted={handleArticlePosted}
            />
        </div>
    );
}
