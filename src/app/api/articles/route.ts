import { prisma } from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('🚀 GET /api/articles called');
  
  try {
    const { searchParams } = new URL(request.url);
    const dept = searchParams.get('dept');
    
    console.log('📊 Parameters:', {
      dept,
      fullUrl: request.url,
      searchParams: Object.fromEntries(searchParams),
    });

    // データベース接続テスト
    await prisma.$connect();
    console.log('✅ Database connected');

    const articles = await prisma.article.findMany({
      where: dept && dept !== 'all' ? { department: dept } : undefined,
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`✅ Found ${articles.length} articles`);

    return NextResponse.json(articles, { status: 200 });
    
  } catch (error) {
    console.error('❌ Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch articles',
        details: error instanceof Error ? error.message : String(error),
      }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, authorId, department, youtubeLinks, siteLinks } = body;

    console.log('📝 POST data:', { title, authorId, department });

    if (!authorId) {
      return NextResponse.json({ error: 'authorId is required' }, { status: 400 });
    }

    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
        authorId,
        department,
        youtubeLinks: youtubeLinks || [],
        siteLinks: siteLinks || [],
      },
    });

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error('❌ POST error:', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
