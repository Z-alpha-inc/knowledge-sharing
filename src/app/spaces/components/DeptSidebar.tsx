// app/spaces/[dept]/components/DeptSidebar.tsx
'use client';

import { useRouter, useParams } from 'next/navigation';
import { Hash } from 'lucide-react';

interface Department {
  id: string;
  name: string;
}

const DEPARTMENTS: Department[] = [
  { id: 'sales', name: '営業部' },
  { id: 'engineering', name: '開発部' },
  { id: 'pr', name: '広報部' },
  { id: 'all', name: '全社共有' },
];

export function DeptSidebar() {
  const router = useRouter();
  const params = useParams();
  const currentDept = params.dept as string;

  const handleDeptChange = (deptId: string) => {
    router.push(`/spaces/${deptId}`);
  };

  return (
    <aside className="w-64 bg-primary flex-shrink-0">
      <div className="p-4 border-b border-primary-foreground/10">
        <h2 className="text-xl font-bold mb-1 text-primary-foreground">ナレッジスペース</h2>
        <p className="text-sm text-primary-foreground/70">社内情報共有</p>
      </div>

      <nav className="p-3">
        <div className="text-xs font-semibold text-primary-foreground/60 px-3 mb-2">
          チャンネル
        </div>
        <div className="space-y-0.5">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept.id}
              onClick={() => handleDeptChange(dept.id)}
              className={`
                w-full flex items-center gap-2 px-3 py-1.5 rounded
                transition-colors text-left text-sm
                ${
                  currentDept === dept.id
                    ? 'bg-white text-primary font-semibold shadow-sm'
                    : 'text-primary-foreground/90 hover:bg-primary-foreground/10'
                }
              `}
            >
              <Hash className="w-4 h-4" />
              <span>{dept.name}</span>
            </button>
          ))}
        </div>
      </nav>
    </aside>
  );
}
