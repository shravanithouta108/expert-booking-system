export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="text-5xl">😕</div>
      <p className="text-slate-700 font-medium">{message || "Something went wrong"}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary text-sm px-4 py-2">
          Try Again
        </button>
      )}
    </div>
  );
}