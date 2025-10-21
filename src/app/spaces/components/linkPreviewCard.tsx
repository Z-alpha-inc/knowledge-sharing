'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

type LinkPreviewProps = {
  url: string;
};

export const LinkPreviewCard = ({ url }: LinkPreviewProps) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        // Microlink APIを使用して、バックエンドを経由せずともリンクプレビュー情報を取得
        const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
        const json = await res.json();
        setData(json.data);
      } catch {
        setData(null);
      }
    };
    fetchPreview();
  }, [url]);

  if (!data) {
    return (
      <Card className="p-3 text-sm text-gray-600 bg-gray-50">
        <a href={url} target="_blank" rel="noopener noreferrer" className="underline">
          {url}
        </a>
        No Website
      </Card>
    );
  }

  return (
    <Card className="flex gap-3 overflow-hidden hover:shadow-md transition">
        <div className="p-3 bg-white border-t">
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline flex items-center gap-2"
            >
                {url}
            </a>
        </div>
        {data.image?.url && (
            <a href={url} target="_blank" rel="noopener noreferrer" className="block w-2/5 aspect-video flex-shrink-0 overflow-hidden">
                <img
                    src={data.image.url}
                    alt={data.title || 'preview'}
                    className="w-full h-full object-cover"
                />
            </a>
        )}
        <div className="flex-1 p-2">
            <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                {data.title || 'No title'}
            </p>
        </div>
    </Card>
  );
};
