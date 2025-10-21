// src/app/api/articles/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';

// 記事一覧を取得するAPI, GET /api/articlesを構築
// deptがあればその部門の記事のみ取得
// [id] などの動的ルートでは、Next.js15以降はPromiseが必要になった(PPRによりidの値を取る前にレンダリングが終わる可能性のため)
// 今回のような動的でない静的(固定)ルートではPromiseは不要
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dept = searchParams.get('dept'); // 例: "sales"

    const articles = await prisma.article.findMany({
      where: dept ? { department: dept } : undefined, // deptがある場合のみwhere句を付与(departmentでフィルタリング)
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

// 記事情報の生成API, POST /api/articlesを構築
// .httpメソッドでデータも送信できる
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, authorId, department, youtubeLinks, siteLinks } = body;

    // authorIdがない場合はエラーを返す
    if (!authorId) {
      return NextResponse.json({ error: 'authorId is required' }, { status: 400 });
    }

    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
        authorId,
        department,
        youtubeLinks,
        siteLinks,
      },
    });

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
