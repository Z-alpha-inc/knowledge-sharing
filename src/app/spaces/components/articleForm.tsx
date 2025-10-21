// src/app/spaces/components/ArticleFormModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Plus,
  X,
  Play,
  Globe,
  Send,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import { MarkdownEditor } from '@/app/spaces/components/markdownEditor';

import { ArticleSchema, ArticleFormData } from '@/schemas/articleSchema'; // スキーマをインポート

interface ArticleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArticlePosted: () => void; // 記事投稿後に親コンポーネントをリフレッシュするためのコールバック
}

export function ArticleFormModal({ isOpen, onClose, onArticlePosted }: ArticleFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [markdownContent, setMarkdownContent] = useState<string | undefined>(''); // MDEditorの状態
  const [isExpanded, setIsExpanded] = useState(false); // 詳細オプションの展開状態

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ArticleFormData>({
    resolver: zodResolver(ArticleSchema),
    defaultValues: {
      title: '',
      content: '',
      // TODO: 本来は認証システムから取得するIDを使用
      // 現時点ではテスト用に適当なUUIDを指定。DBに存在するauthorIdに置き換えてください。
      authorId: 'cmgvj2tnz00008oalmmcl7qfk', 
      department: 'all', // デフォルトは「全社」
      youtubeLinks: [], // 最初から1つの入力欄を表示
      siteLinks: [],    // 最初から1つの入力欄を表示
    },
  });

  // MDEditorのコンテンツをreact-hook-formに登録
  const watchedContent = watch('content');
  
  // YouTube URLの動的入力欄
  const {
    fields: youtubeFields,
    append: appendYoutube,
    remove: removeYoutube,
  } = useFieldArray({ control, name: 'youtubeLinks' });

  // サイトURLの動的入力欄
  const {
    fields: siteFields,
    append: appendSite,
    remove: removeSite,
  } = useFieldArray({ control, name: 'siteLinks' });

  // モーダルが閉じられた時にフォームをリセット
  useEffect(() => {
    if (!isOpen) {
      reset();
      setMarkdownContent('');
      setIsExpanded(false);
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: ArticleFormData) => {
    setIsSubmitting(true);
    try {
      // 空のURL文字列をフィルターしてからAPIに送信
      const filteredData = {
        ...data,
      youtubeLinks: data.youtubeLinks
        ?.map(link => link.url?.trim()) // mapでオブジェクトからurl文字列を抽出
        .filter(url => url !== ''),
      siteLinks: data.siteLinks
        ?.map(link => link.url?.trim()) // mapでオブジェクトからurl文字列を抽出
        .filter(url => url !== ''),
      };

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filteredData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '記事の投稿に失敗しました');
      }

      alert('記事が正常に投稿されました！');
      reset(); // フォームをリセット
      setValue('content', ''); // MDEditorの値をクリア
      setMarkdownContent(''); // MDEditorの内部状態をクリア
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
            <MarkdownEditor
                value={markdownContent} // markdownContent はプレビューの**「元データ」、実際に書いている文章
                onChange={(value) => { 
                    setMarkdownContent(value); // markdown更新を担うsetMarkdownContent 関数
                    setValue('content', value || ''); // react-hook-formに設定する値も更新
                }}
                error={errors.content?.message}
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
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">投稿先部門:</Label>
                  <RadioGroup
                    onValueChange={(value) => setValue('department', value as 'sales' | 'engineering' | 'pr' | 'all')}
                    defaultValue={watch('department')}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="department-all" />
                      <Label htmlFor="department-all">全社</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="engineering" id="department-engineering" />
                      <Label htmlFor="department-engineering">開発</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sales" id="department-sales" />
                      <Label htmlFor="department-sales">営業</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pr" id="department-pr" />
                      <Label htmlFor="department-pr">広報</Label>
                    </div>
                  </RadioGroup>
                  {errors.department && (
                    <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>
                  )}
                </div>

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

                {/* YouTube URL入力欄 */}
                <div className="space-y-2">
                  <Label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Play className="w-4 h-4 text-red-500" />
                    YouTube URL (複数可):
                  </Label>
                  {youtubeFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Input
                        {...register(`youtubeLinks.${index}.url`)}
                        placeholder="YouTubeのURLを入力"
                        className={`text-sm ${errors.youtubeLinks?.[index]?.url ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {youtubeFields.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeYoutube(index)}
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-red-500 h-8 w-8"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {errors.youtubeLinks && (
                    <p className="text-red-500 text-xs mt-1">{errors.youtubeLinks.message}</p>
                  )}
                  <Button
                    type="button"
                    onClick={() => appendYoutube({ url: '' })}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-blue-600 border-blue-600 hover:bg-blue-50 h-8 text-xs"
                  >
                    <Plus className="w-3 h-3" />
                    YouTube URLを追加
                  </Button>
                </div>

                {/* WebサイトURL入力欄 */}
                <div className="space-y-2">
                  <Label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Globe className="w-4 h-4 text-blue-500" />
                    WebサイトURL (複数可):
                  </Label>
                  {siteFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Input
                        {...register(`siteLinks.${index}.url`)}
                        placeholder="WebサイトのURLを入力"
                        className={`text-sm ${errors.siteLinks?.[index]?.url ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {siteFields.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeSite(index)}
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-red-500 h-8 w-8"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {errors.siteLinks && (
                    <p className="text-red-500 text-xs mt-1">{errors.siteLinks.message}</p>
                  )}
                  <Button
                    type="button"
                    onClick={() => appendSite({ url: '' })}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-blue-600 border-blue-600 hover:bg-blue-50 h-8 text-xs"
                  >
                    <Plus className="w-3 h-3" />
                    WebサイトURLを追加
                  </Button>
                </div>
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