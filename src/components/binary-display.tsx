import { Badge } from '@/components/ui/badge';

interface BinaryDisplayProps {
  bits: string[];
  className?: string;
  opacity?: (index: number) => boolean;
}

export function BinaryDisplay({
  bits,
  className = '',
  opacity
}: BinaryDisplayProps) {
  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {bits.map((bit, index) => (
        <Badge
          key={`${index}-${bit}`}
          variant="outline"
          className={`w-10 h-10 flex text-lg rounded-md ${
            opacity && !opacity(index) ? 'opacity-30' : ''
          }`}
        >
          {bit}
        </Badge>
      ))}
    </div>
  );
}
