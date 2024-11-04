import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShadcnUI multi step form example",
  description: "The simplest possible example",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
