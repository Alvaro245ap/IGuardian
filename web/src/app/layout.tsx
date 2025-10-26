import "./../styles/globals.css";
import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-6xl p-4">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">eguardian</h1>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
