import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Code Health",
  description: "Analisador de qualidade de código moderno.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
