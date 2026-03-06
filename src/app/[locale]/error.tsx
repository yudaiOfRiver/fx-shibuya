"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-50 mb-4">Error</h1>
        <p className="text-slate-400 mb-6">
          Something went wrong loading the exchange rates.
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-cyan-400 text-slate-900 rounded-lg font-medium hover:bg-cyan-300 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
