import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { TodoProvider } from "@/lib/context/TodoContext";
import { ToastContainer } from "@/components/ui/ToastContainer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlowTask | Smart To-Do & Productivity Management",
  description: "A modern, high-performance To-Do application built with Next.js, Supabase, and Tailwind CSS. Manage tasks, deadlines, priorities, and projects with ease.",
  keywords: ["todo list", "task management", "productivity", "supabase", "nextjs", "linear style"],
  authors: [{ name: "FlowTask Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-[#090d16] dark:text-slate-100 selection:bg-blue-500 selection:text-white">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TodoProvider>
            {children}
            <ToastContainer />
          </TodoProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
