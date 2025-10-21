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
    <Card className="overflow-hidden bg-white-50">
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
        {/* 🎬 Slack風・コンパクトYouTubeプレビュー */}
        <div className="flex justify-center p-2">
            <div
                className="relative rounded-lg overflow-hidden"
                style={{
                    width: '480px',     // 👈 横幅を固定して小さく
                    height: '270px',    // 👈 16:9比率（640 * 9 / 16）
                }}
            >
            <YouTubeEmbed
                videoid={videoId}
                params="rel=0"
                style="width:100%;height:100%;border-radius:0.5rem;"
            />
            </div>
        </div>
    </Card>
  );
};
