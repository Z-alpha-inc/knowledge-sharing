# knowledge-sharing

## 技術スタック

### フロントエンド
- Next.js(React)
- TailwindCSS
- TypeScript
- shadcn/ui(Theme: Orange)
- Lucide React(shadcnインストール時に付随)
- react-hook-form(投稿機能のコード量削減など)
- zod(バリデーションの作成を容易に)
- @uiw/react-md-editor(markdownプレビューなどを容易に)

## Getting Started

1. .envファイルの中身を取得

2. Run the development server:

```bash
npm install # これでできなければnode_modulesとpackage-lock.jsonを削除して、再度npm install
npx prisma generate # スキーマに関する内容を取り入れる, gerated/prismaフォルダの生成
npm run dev # 今回はこちら
# yarn dev
# pnpm dev
# bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## prismaセットアップ手順(mongo)
1. `npm install prisma --save-dev`
2. `npx prisma init`
3. 
```
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}
```

4. `DATABASE_URL="mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/your-db-name?retryWrites=true&w=majority"`を設定

5. `npx prisma db push`でモデルをデータベースに反映
(後から更新できるので、別に最初は最小モデルでOK)

6. APIなどでデータを登録するとデータベースで確認できるようになる

## schema.prisma修正時(mongo)
1. `schema.prisma`でスキーマを修正
2. `npx prisma generate`を実行して、prisma clientを修正
3. POST関数などを新しいスキーマに対応させる
4. POSTなどをすると、MongoDB Conpass側に新しいスキーマが反映される
5. データベース側で操作して、各データを新しいフィールドになるように適応
6. PUTなどで既存のデータに新しいフィールドを適用(データベース直編集ではうまくいかない可能性あり)
7. GETで確認
