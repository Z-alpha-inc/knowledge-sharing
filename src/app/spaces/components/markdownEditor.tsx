'use client';
import { Label } from '@/components/ui/label';
import MDEditor from '@uiw/react-md-editor';

type MarkdownEditorProps = {
  value: string | undefined; // markdownContent という state 変数（文字列）
  onChange: (value: string | undefined) => void; // markdown文章変化に関する関数
  error?: string; // バリデーションエラーメッセージ
}

// マークダウン編集部分コンポーネント
export const MarkdownEditor = ({ value, onChange, error }: MarkdownEditorProps) => {
    return (
        <div data-color-mode="light">
            <Label htmlFor="content" className="sr-only">内容</Label>
            <MDEditor
                value={value}
                onChange={onChange}
                textareaProps={{
                    placeholder: '記事の内容をMarkdown形式で記述してください',
                    id: 'content',
                }}
                preview="live" // リアルタイムプレビュー
                height={300}
                className={`border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
        </div>
    );
}
