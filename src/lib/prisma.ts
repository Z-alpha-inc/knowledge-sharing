// Prisma Clientをインポートする
import { PrismaClient } from '@/generated/prisma/client';

// インスタンスを作成する (これがDB操作の窓口になる)
// データベースへのすべての操作（データの取得、作成、更新、削除など）を実行するためのインスタンス
export const prisma = new PrismaClient();
