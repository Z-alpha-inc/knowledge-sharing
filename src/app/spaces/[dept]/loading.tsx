import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// page.tsxのデータ取得中に自動的に表示されるローディングコンポーネント
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダーのスケルトン */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            {/* タイトル部分のスケルトン */}
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          
          {/* 投稿ボタンのスケルトン */}
          <Button disabled className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <span>投稿</span>
          </Button>
        </div>
      </header>

      {/* メインコンテンツのスケルトン */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {/* 記事カードのスケルトンを3つほど表示 */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 items-start">
              {/* アバターのスケルトン */}
              <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
              
              {/* 記事カード本体のスケルトン */}
              <div className="w-full space-y-3 p-4 border bg-white rounded-lg">
                <Skeleton className="h-5 w-3/4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
