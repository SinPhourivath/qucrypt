import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BasisSelectorProps {
  bases: string[];
  onToggle: (index: number) => void;
  disabled?: boolean;
  opacity?: (index: number) => boolean;
  className?: string;
}

export function BasisSelector({
  bases,
  onToggle,
  disabled = false,
  opacity,
  className = ''
}: BasisSelectorProps) {
  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {bases.map((basis, index) => (
        <Button
          key={`${index}-${basis}`}
          onClick={() => onToggle(index)}
          variant="outline"
          size="icon"
          disabled={disabled}
          className={`w-10 h-10 bg-white shadow-none ${
            disabled ? 'cursor-default' : 'cursor-pointer'
          } ${opacity && !opacity(index) ? 'opacity-30' : ''}`}
        >
          {basis === '+' ? (
            <Plus className="w-6 h-6" />
          ) : (
            <X className="w-6 h-6" />
          )}
        </Button>
      ))}
    </div>
  );
}
