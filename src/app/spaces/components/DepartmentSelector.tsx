'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface DepartmentSelectorProps {
  value?: 'all' | 'engineering' | 'sales' | 'pr';
  onChange: (value: 'all' | 'engineering' | 'sales' | 'pr') => void;
  error?: string;
}

export function DepartmentSelector({ value, onChange, error }: DepartmentSelectorProps) {
  return (
    <div>
      <Label className="block text-sm font-medium text-gray-700 mb-2">投稿先部門:</Label>
      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as 'all' | 'engineering' | 'sales' | 'pr')}
        className="flex flex-wrap gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="department-all" />
          <Label htmlFor="department-all">全社</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="engineering" id="department-engineering" />
          <Label htmlFor="department-engineering">開発</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="sales" id="department-sales" />
          <Label htmlFor="department-sales">営業</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="pr" id="department-pr" />
          <Label htmlFor="department-pr">広報</Label>
        </div>
      </RadioGroup>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
