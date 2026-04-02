export default function SkeletonCard() {
  return (
    <div className="flex flex-col h-full bg-[#080808] border border-white/5 animate-pulse">
      <div className="aspect-[3/4] bg-white/5" />
      <div className="p-4 space-y-4">
        <div className="h-2 bg-white/10 w-1/3" />
        <div className="h-4 bg-white/10 w-full" />
        <div className="h-8 bg-white/10 w-1/2 mt-4" />
      </div>
    </div>
  );
}