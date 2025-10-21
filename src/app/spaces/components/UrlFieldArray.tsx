'use client';

import {
    useFieldArray,
    Control,
    UseFormRegister,
    FieldErrors
} from 'react-hook-form';
import { ArticleFormData } from '@/schemas/articleSchema';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';

// このコンポーネントが受け取る Props の型
type UrlFieldArrayProps = {
    // react-hook-form から渡すもの
    control: Control<ArticleFormData>; // これがあることで、nameにはArticleFormDataにある型のみが適用される
    register: UseFormRegister<ArticleFormData>; // これがあることで、ArticleFormDataにある型のみが登録される
    errors: FieldErrors<ArticleFormData>;

    // どのフィールド配列を扱うか
    fieldName: 'youtubeLinks' | 'siteLinks';

    // UIをカスタマイズするためのもの
    label: string;
    placeholder: string;
    icon: React.ReactNode; // アイコンを React 要素として受け取る
    addButtonText: string;
}

export function UrlFieldArray({
    control,
    register,
    errors,
    fieldName,
    label,
    placeholder,
    icon,
    addButtonText,
}: UrlFieldArrayProps) {

    // このコンポーネント内で useFieldArray を呼び出す
    const { fields, append, remove } = useFieldArray({
        control, // 引数でもらったuseFormのcontrolと連携
        name: fieldName, // 動的にフィールド名を指定
    });

    // エラーオブジェクトを動的に取得
    const fieldErrors = fieldName === 'youtubeLinks'
        ? errors.youtubeLinks
        : errors.siteLinks;

    return (
        <div className="space-y-2">
            <Label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                {icon} {/* 渡されたアイコンを表示 */}
                {label}
            </Label>

            {fields.map((field, index) => (
                <div key={field.id}>
                    <div className="flex items-center gap-2">
                        <Input
                            {...register(`${fieldName}.${index}.url`)}
                            placeholder={placeholder}
                            className={`text-sm ${fieldErrors?.[index]?.url ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {fields.length > 1 && (
                            <Button
                                type="button"
                                onClick={() => remove(index)} // 内部の remove を呼ぶ
                                variant="ghost"
                                size="icon"
                                className="text-gray-500 hover:text-red-500 h-8 w-8"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                    {fieldErrors?.[index]?.url && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors[index].url.message}</p>
                    )}
                </div>
            ))}

            <Button
                type="button"
                onClick={() => append({ url: '' })} // 内部の append を呼ぶ
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-blue-600 border-blue-600 hover:bg-blue-50 h-8 text-xs"
            >
                <Plus className="w-3 h-3" />
                {addButtonText}
            </Button>
        </div>
    );
}
