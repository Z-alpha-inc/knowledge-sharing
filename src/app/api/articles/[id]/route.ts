// src/app/api/articles/[id]/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';

// 記事一覧を取得するAPI, GET /api/articles/[id]を構築
// .httpメソッドでデータも取得できる
export async function GET(
    { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // prismaを使うことで、prisma.article.findUnique()でarticlesテーブルの全データを取得
  try{
    const article = await prisma.article.findUnique({
        where:{
            id: id // ここに取得したい記事のIDを指定
        }
        //include: {
        //  author: true,
        //},
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article, { status: 200 });
  }catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }

}
