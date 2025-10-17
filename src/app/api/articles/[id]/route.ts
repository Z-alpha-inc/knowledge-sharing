// src/app/api/articles/[id]/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';

// 記事1つだけを取得するAPI, GET /api/articles/[id]を構築
// .httpメソッドでデータも取得できる
export async function GET(
    request: NextRequest, // 使うわけではないがこれがないと、URLパラメータが取得できない
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
    return NextResponse.json({ error: 'Failed to fetch an article' }, { status: 500 });
  }

}

// 記事1つを削除するAPI, DELETE /api/articles/[id]を構築
// .httpメソッドでデータも削除できる
export async function DELETE(
    request: NextRequest, // 使うわけではないがこれがないと、URLパラメータが取得できない
    { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // prismaを使うことで、prisma.article.delete()でarticlesテーブルの全データを取得
  try{
    const article = await prisma.article.delete({
        where:{
            id: id // ここに削除したい記事のIDを指定
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
    return NextResponse.json({ error: 'Failed to delete an article' }, { status: 500 });
  }

}

// 記事1つを更新するAPI, PUT /api/articles/[id]を構築
// .httpメソッドでデータも更新できる
export async function PUT(
    request: NextRequest, // 使うわけではないがこれがないと、URLパラメータが取得できない
    { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  // prismaを使うことで、prisma.article.update()でarticlesテーブルの全データを取得
  try{
    const article = await prisma.article.update({
        where:{
            id: id // ここに削除したい記事のIDを指定
        },
        data: body
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
    return NextResponse.json({ error: 'Failed to delete an article' }, { status: 500 });
  }

}
