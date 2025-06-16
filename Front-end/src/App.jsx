export default function App() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div role="alert" className="rounded-lg border border-gray-200 bg-white p-4 shadow w-full max-w-md">
        <div className="flex items-start gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
          </svg>

          <div className="flex-1">
            <strong className="block font-medium text-gray-900">Success</strong>
            <p className="mt-1 text-sm text-gray-700">Your settings have been saved successfully.</p>
          </div>

          <button
            type="button"
            className="text-gray-400 transition hover:text-gray-600"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>
    </main>
  );
}