import type { Metadata } from "next";
import "./globals.css";
import { themeInitScript } from "@/lib/theme/themeScript";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";

export const metadata: Metadata = {
  title: "Nuralix — AI Business Operating System",
  description: "Autonomous executive intelligence, dynamic dashboard, and decision simulation platform for businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-bg text-text antialiased selection:bg-brass selection:text-white min-h-screen">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
