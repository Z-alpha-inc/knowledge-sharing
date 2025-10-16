// src/app/api/articles/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';

// 記事一覧を取得するAPI, GET /api/articlesを構築
// .httpメソッドでデータも取得できる
export async function GET() {
  // prismaを使うことで、prisma.article.findMany()でarticlesテーブルの全データを取得
  try{
    const users = await prisma.user.findMany({
      // 後に関連するauthorの情報も一緒に取得
      include: {
        articles: true,
      },
      orderBy: {
        name: 'desc',
      }
    });

    return NextResponse.json(users , { status: 200 });
  }catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }

}

// 記事情報の生成API, POST /api/articlesを構築
// .httpメソッドでデータも送信できる
// articlesは、@relationでarticlesテーブルとUserテーブルが紐づけるためだけにあるので、ここで登録は不要
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body; // スキーマにはpasswordがないため、ここではnameとemail

    if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const newUser = await prisma.user.create({
        data: { name, email },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
