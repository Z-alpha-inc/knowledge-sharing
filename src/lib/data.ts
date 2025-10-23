import { Article } from '@/types';
import { prisma } from '@/lib/prisma';

// 単一の記事を取得する関数
export async function getAnArticleFromDb(id: string): Promise<Article | null> { // 戻り値を単一（または null）に変更
  console.log(`[DB Direct] Fetching article for id: ${id}`); // dept を id に変更

  try {
    const articleFromDb = await prisma.article.findUnique({
        where:{
            id: id 
        },
        include: {
          author: true,
        },
    });

    // 記事が見つからなかった場合
    if (!articleFromDb) {
      console.log(`[DB Direct] Article not found for id: ${id}`);
      return null;
    }

    // Dateをstringに変換（シリアライズ）する
    // .map は不要（単一のオブジェクトのため）
    const article: Article = {
      ...articleFromDb,
      createdAt: articleFromDb.createdAt.toISOString(),
      updatedAt: articleFromDb.updatedAt.toISOString(),
    };

    console.log(`[DB Direct] Found article`);
    return article; // 取得した単一の記事データを返す

  } catch (error) {
    console.error('[DB Direct] Error fetching article:', error);
    return null; // エラー時は null を返す
  }
}

// APIのGETルートにあったDB取得処理をここに移動
export async function getArticlesFromDb(dept: string): Promise<Article[]> {
  console.log(`[DB Direct] Fetching articles for dept: ${dept}`);

  try {
    // データベース接続（すでにあるprisma.tsで$connectされていれば不要かも）
    const articlesFromDb = await prisma.article.findMany({
      where: dept ? { department: dept } : undefined,
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`[DB Direct] Found ${articlesFromDb.length} articles`);

    // Dateをstringに変換（シリアライズ）する
    // Prismaから返る "Date" 型を、Article型の "string" 型に合わせる
    const articles: Article[] = articlesFromDb.map(article => ({
      ...article,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
    }));

    console.log(`[DB Direct] Found ${articles.length} articles`);
    return articles; // 取得したデータをそのまま返す

  } catch (error) {
    console.error('[DB Direct] Error fetching articles:', error);
    return []; // エラー時は空配列を返す
  }
}