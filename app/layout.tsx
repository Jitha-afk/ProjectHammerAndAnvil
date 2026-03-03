import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project Hammer And Anvil",
  description: "Your one stop shop to trap and defeat the enemy.",
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
