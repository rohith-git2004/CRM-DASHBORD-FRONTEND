import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRM Dashboard",
  description: "CRM Machine Test",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}