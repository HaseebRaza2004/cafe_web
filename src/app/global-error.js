"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body className="bg-black text-white flex items-center justify-center min-h-screen">
        <div className="text-center p-8 border border-red-500/30 bg-red-950/20 rounded-xl">
          <h2 className="text-3xl font-bold text-red-500 mb-4">
            Critical System Error
          </h2>
          <p className="text-gray-300 mb-6">
            The application failed to load correctly.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-white text-black font-semibold rounded-md hover:bg-gray-200 transition cursor-pointer"
          >
            Restart Application
          </button>
        </div>
      </body>
    </html>
  );
};