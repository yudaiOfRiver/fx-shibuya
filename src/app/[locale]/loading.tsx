export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-cyan-400 border-r-transparent" />
        <p className="mt-4 text-sm text-slate-400">Loading rates...</p>
      </div>
    </div>
  );
}
