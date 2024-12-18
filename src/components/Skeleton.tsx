interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div 
      className={`bg-zinc-900 relative overflow-hidden rounded-lg ${className}`}
    >
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
          animation: 'shimmer 1.2s infinite linear'
        }}
      />
    </div>
  );
}
