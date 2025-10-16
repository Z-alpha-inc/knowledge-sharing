// src/app/api/articles/route.ts

// 1. Prisma Clientをインポートする
import { PrismaClient } from '@/generated/prisma/client';
import { NextResponse } from 'next/server';

// 2. インスタンスを作成する (これがDB操作の窓口になる)
const prisma = new PrismaClient();

// 記事一覧を取得するAPI
export async function GET() {
  // 3. 実際にデータベースにアクセスする
  const articles = await prisma.article.findMany({
    // 関連するauthorの情報も一緒に取得
    include: {
      author: true,
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  // 4. 取得したデータをJSONとして返す
  return NextResponse.json(articles);
}

// 他のAPI (POSTなど) も同様にここへ追加していく...