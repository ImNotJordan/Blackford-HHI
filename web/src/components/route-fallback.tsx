export function RouteFallback() {
  return (
    <div className="animate-pulse space-y-4" aria-hidden>
      <div className="h-8 w-2/3 max-w-md rounded-[10px] bg-hairline" />
      <div className="h-4 w-1/2 max-w-sm rounded-[10px] bg-hairline" />
      <div className="h-40 rounded-[10px] border border-hairline bg-surface" />
    </div>
  );
}
