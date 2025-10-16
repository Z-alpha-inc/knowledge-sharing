// src/app/api/articles/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';

// 記事一覧を取得するAPI, GET /api/articlesを構築
// .httpメソッドでデータも取得できる
export async function GET() {
  // prismaを使うことで、prisma.article.findMany()でarticlesテーブルの全データを取得
  try{
    const articles = await prisma.article.findMany({
      // 後に関連するauthorの情報も一緒に取得
      //include: {
      //  author: true,
      //},
      orderBy: {
        createdAt: 'desc',
      }
    });

    return NextResponse.json(articles, { status: 200 });
  }catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }

}

// 記事情報の生成API, POST /api/articlesを構築
// .httpメソッドでデータも送信できる
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, authorId } = body;

    // authorIdがない場合はエラーを返す
    if (!authorId) {
      return NextResponse.json({ error: 'authorId is required' }, { status: 400 });
    }

    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
        authorId, // 送られてきたIDで記事を作成
      },
    });

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
