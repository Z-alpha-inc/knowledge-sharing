// src/app/spaces/components/ArticleFormModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  X,
  Play,
  Globe,
  Send,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import { MarkdownEditor } from '@/app/spaces/components/markdownEditor';
import { DepartmentSelector } from '@/app/spaces/components/DepartmentSelector';
import { UrlFieldArray } from '@/app/spaces/components/UrlFieldArray';

import { ArticleSchema, ArticleFormData } from '@/schemas/articleSchema'; // スキーマをインポート
import { createArticle } from '@/lib/createArticle';

interface ArticleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArticlePosted: () => void; // 記事投稿後に親コンポーネントをリフレッシュするためのコールバック
}

export function ArticleFormModal({ isOpen, onClose, onArticlePosted }: ArticleFormModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false); // 詳細オプションの展開状態

    const {
        register, // HTMLの標準的な入力欄（<input> や <textarea> など）を react-hook-form に「登録」(useStateでわざわざ取得しなくていい)
        handleSubmit, // onSubmitで提出する際にバリデーションを行うなど、提出周りを担う
        control, // register が使えない複雑なUIコンポーネント（例: 動的な入力欄）をフォームに接続する
        formState: { errors }, // formState はフォームの現在の状態（送信中か、エラーがあるかなど）を保持するオブジェクトで、今はerrorsだけを取得
        reset, // フォームの全フィールドを defaultValues（初期値）に戻す
    } = useForm<ArticleFormData>({
        resolver: zodResolver(ArticleSchema), // バリデーション（検証）ルールとしてzodスキーマを使用
        defaultValues: { // 初期値、またreset() を呼んだ時の初期値
        title: '',
        content: '',
        // TODO: 本来は認証システムから取得するIDを使用
        // 現時点ではテスト用に適当なUUIDを指定。DBに存在するauthorIdに置き換えてください。
        authorId: 'cmgvj2tnz00008oalmmcl7qfk', 
        department: 'all', // デフォルトは「全社」
        youtubeLinks: [], // 最初は入力欄を表示しない
        siteLinks: [],    // 最初は入力欄を表示しない
        },
    });

    // モーダルが閉じられた時にフォームをリセット
    useEffect(() => {
        if (!isOpen) {
            reset();
            setIsExpanded(false);
        }
    }, [isOpen, reset]);

    const onSubmit = async (data: ArticleFormData) => {
        setIsSubmitting(true);
        try {
            await createArticle(data);
            alert('記事が正常に投稿されました！');
            reset(); // フォームをリセット
            setIsExpanded(false); // 詳細オプションを閉じる
            onArticlePosted(); // 記事一覧をリフレッシュしてモーダルを閉じる
        } catch (error) {
            console.error('記事投稿エラー:', error);
            alert(`記事の投稿に失敗しました`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
        {/* オーバーレイ（背景） */}
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
        />

        {/* モーダル本体 */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* ヘッダー */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h2 className="text-xl font-semibold text-gray-900">記事を投稿</h2>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                <X className="w-6 h-6" />
                </button>
            </div>

            {/* フォーム */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                {/* タイトル入力 */}
                <div>
                <Label htmlFor="title" className="sr-only">タイトル</Label>
                <Input
                    id="title"
                    placeholder="タイトル"
                    {...register('title')}
                    className={`border focus:border-blue-500 text-base p-3 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.title && (
                    <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
                )}
                </div>

                {/* Markdownエディタ */}
                <Controller
                    control={control} // 司令塔を渡す
                    name="content" // 管理するフィールド名
                    // 仲介役が "field" と "fieldState" を用意してくれる
                    render={({ field, fieldState }) => ( 
                        <MarkdownEditor
                            value={field.value} // 司令塔が管理する「現在の値」を渡す
                            onChange={field.onChange} // 司令塔が管理する「変更関数」を渡す
                            error={fieldState.error?.message} // 司令塔が管理する「エラー状態」を渡す
                        />
                    )}
                />

                {/* 詳細オプション展開ボタン */}
                <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                    {isExpanded ? (
                    <>
                        <ChevronUp className="w-4 h-4" />
                        <span>詳細オプションを閉じる</span>
                    </>
                    ) : (
                    <>
                        <ChevronDown className="w-4 h-4" />
                        <span>詳細オプション（リンク追加・部門選択）</span>
                    </>
                    )}
                </button>

                {/* 詳細オプション（展開時のみ表示） */}
                {isExpanded && (
                    <div className="space-y-4 pt-2 border-t border-gray-200">
                        {/* 部門選択 */}
                        <Controller
                            control={control} // useForm() から受け取った「司令塔」オブジェクト
                            name="department" // controlの中でもdepartmentという名前のフィールドを担当
                            // 実際に画面に表示するコンポーネントを描画する」ための関数
                            render={({ field, fieldState }) => ( // controlから受け取ったdepartment 用のデータ（field）と状態（fieldState）
                                <DepartmentSelector
                                    value={field.value} // 現在の選択肢
                                    onChange={field.onChange} // setValue('department', ...) を内部でやってくれる
                                    error={fieldState.error?.message} // バリデーションエラーメッセージ
                                />
                            )}
                        />

                        {/* ユーザーID入力 (一時的) */}
                        <div>
                            <Label htmlFor="authorId" className="block text-sm font-medium text-gray-700">投稿者ID (一時的):</Label>
                            <Input
                                id="authorId"
                                placeholder="例: clx0i6s73000008lcg3g37tvy"
                                {...register('authorId')}
                                className={`text-sm ${errors.authorId ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.authorId && (
                                <p className="text-red-500 text-xs mt-1">{errors.authorId.message}</p>
                            )}
                        </div>

                        {/* YouTubeURL入力欄 */}
                        <UrlFieldArray
                            control={control}
                            register={register}
                            errors={errors}
                            fieldName="youtubeLinks"
                            label="YouTube URL (複数可):"
                            placeholder="YouTubeのURLを入力"
                            icon={<Play className="w-4 h-4 text-red-500" />}
                            addButtonText="YouTube URLを追加"
                        />
                        
                        {/* WebサイトURL入力欄 */}
                        <UrlFieldArray
                            control={control}
                            register={register}
                            errors={errors}
                            fieldName="siteLinks"
                            label="WebサイトURL (複数可):"
                            placeholder="WebサイトのURLを入力"
                            icon={<Globe className="w-4 h-4 text-blue-500" />}
                            addButtonText="WebサイトURLを追加"
                        />
                    </div>
                )}

                {/* 送信ボタン */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onClose}
                    disabled={isSubmitting}
                >
                    キャンセル
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6">
                    {isSubmitting ? '投稿中...' : '投稿'}
                    <Send className="w-4 h-4" />
                </Button>
                </div>
            </form>
            </div>
        </div>
        </>
    );
}