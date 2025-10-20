'use client';
import { Badge } from '@/components/ui/badge';

type CardHeaderProps = {
    name: string;
    createdAt: string;
};

// 記事カードヘッダー部分コンポーネント
export const CardHeader = ({ name, createdAt }: CardHeaderProps) => {
    const formatDate = (dateString: string) => {
        const today = new Date(dateString);
        const formatted = today
        .toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        })
        .split("/");
        return formatted.join("/");
    };
    return (
        <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-gray-900">
                {name}
            </span>
            <Badge variant="outline" className="text-xs">
                {formatDate(createdAt)}
            </Badge>
        </div>
    );
}
