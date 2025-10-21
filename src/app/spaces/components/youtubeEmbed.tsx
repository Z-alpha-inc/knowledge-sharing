'use client';

import { Card } from '@/components/ui/card';
import { YouTubeEmbed } from '@next/third-parties/google';

type YouTubeEmbedProps = {
  url: string;
};

// URLからvideoIdを抽出
const extractVideoId = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes('youtu.be')) {
      return parsedUrl.pathname.slice(1);
    }
    if (parsedUrl.searchParams.has('v')) {
      return parsedUrl.searchParams.get('v');
    }
    // /embed/xxxx パターン対応
    const match = parsedUrl.pathname.match(/embed\/([^/]+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
};

export const YouTubeCard = ({ url }: YouTubeEmbedProps) => {
  const videoId = extractVideoId(url);
  if (!videoId) {
    return (
      <Card className="p-4 border-red-200 bg-red-50">
        <p className="text-red-600 text-sm">無効なYouTube URLです</p>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-sm break-all"
        >
          {url}
        </a>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden bg-gray-50">
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
        <div className="rounded-md overflow-hidden">
            {/* 🚀 Lite YouTube Embed (iframe lazy load + nocookie対応) */}
            <YouTubeEmbed videoid={videoId} params="rel=0" style="max-width: 100%;" />
        </div>
    </Card>
  );
};
