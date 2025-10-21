export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  // articles?: Article[]; // まだUI側でユーザーの記事一覧などは使わない
};

export type Article = {
  id: string;
  title: string;
  content: string;
  status: string;
  author: User;
  department: string;
  youtubeLinks: string[];
  siteLinks: string[];
  createdAt: string; // 時間は文字列で返ってくる
  updatedAt: string; // 時間は文字列で返ってくる
};
