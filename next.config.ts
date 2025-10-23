import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/', // サイトのトップページを指す
        destination: '/spaces/all', // トップページに来たときの転送先パス(リダイレクト先)
        permanent: true, // このURLは恒久的に /spaces/all に移動することを示す (SEOに強い, 検索エンジンもこっちを優先して表示)
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',   // すべてのパスを許可
        port: '',
        pathname: '/**', 
      },
    ],
  },
};

export default nextConfig;
