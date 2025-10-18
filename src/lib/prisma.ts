// src/lib/prisma.ts
// Prisma Clientをインポートする
import { PrismaClient } from '@/generated/prisma/client';

// https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections
// Next.jsのホットリロード時などにPrisma Clientのインスタンスが複数作成されるのを防ぐための設定
// これでデータベース接続がエラーになった時に修正はできなかったが
// 未然に防げる「可能性」はあるので、一度実装
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = 
  globalForPrisma.prisma ||  // 既にあれば再利用
  new PrismaClient()         // なければ新規作成

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma  // グローバルに保存
}
