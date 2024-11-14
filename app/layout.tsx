import type { Metadata } from "next";
import "@/components/ui/globals.css";

export const metadata: Metadata = {
  title: "My Todo",
  description: "My Todo App with Next.js, React, and TypeScript",
};

export default function RootLayout({ children }: LayoutProps): JSX.Element {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
