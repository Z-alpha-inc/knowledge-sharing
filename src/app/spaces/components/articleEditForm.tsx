// src/app/spaces/components/ArticleEditModal.tsx
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
  Save,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import { MarkdownEditor } from '@/app/spaces/components/markdownEditor';
import { DepartmentSelector } from '@/app/spaces/components/DepartmentSelector';
import { UrlFieldArray } from '@/app/spaces/components/UrlFieldArray';

import { ArticleSchema, ArticleFormData } from '@/schemas/articleSchema';
import { Article } from '@/types';

interface ArticleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArticleUpdated: () => void;
  article: Article;
}

export function ArticleEditModal({ 
  isOpen, 
  onClose, 
  onArticleUpdated,
  article 
}: ArticleEditModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<ArticleFormData>({
        resolver: zodResolver(ArticleSchema),
        defaultValues: {
            title: article.title,
            content: article.content,
            authorId: article.author.id,
            department: article.department as "sales" | "engineering" | "pr" | "all",
            youtubeLinks: article.youtubeLinks?.map(url => ({ url })) || [],
            siteLinks: article.siteLinks?.map(url => ({ url })) || [],
        },
    });

    // モーダルが開かれた時にフォームを記事データで初期化
    useEffect(() => {
        if (isOpen) {
            // URLが存在する場合は詳細オプションを展開
            if ((article.youtubeLinks && article.youtubeLinks.length > 0) || 
                (article.siteLinks && article.siteLinks.length > 0)) {
                setIsExpanded(true);
            }
        }
    }, [isOpen, article]);

    // モーダルが閉じられた時にフォームをリセット
    useEffect(() => {
        if (!isOpen) {
            setIsExpanded(false);
        }
    }, [isOpen]);

    const onSubmit = async (data: ArticleFormData) => {
        setIsSubmitting(true);
        try {
            const requestData = {
                ...data,
                youtubeLinks: data.youtubeLinks
                    ?.map(link => link.url?.trim())
                    .filter(url => url !== ''),
                siteLinks: data.siteLinks
                    ?.map(link => link.url?.trim())
                    .filter(url => url !== ''),
            };
            const response = await fetch(`/api/articles/${article.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                throw new Error('記事の更新に失敗しました');
            }

            alert('記事が正常に更新されました！');
            onArticleUpdated(); // 記事詳細をリフレッシュしてモーダルを閉じる
        } catch (error) {
            console.error('記事更新エラー:', error);
            alert('記事の更新に失敗しました');
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
                        <h2 className="text-xl font-semibold text-gray-900">記事を編集</h2>
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
                            control={control}
                            name="content"
                            render={({ field, fieldState }) => ( 
                                <MarkdownEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
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
                                    control={control}
                                    name="department"
                                    render={({ field, fieldState }) => (
                                        <DepartmentSelector
                                            value={field.value}
                                            onChange={field.onChange}
                                            error={fieldState.error?.message}
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
                                {isSubmitting ? '更新中...' : '更新'}
                                <Save className="w-4 h-4" />
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}