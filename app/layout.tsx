import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Signal Journal | Ideas with staying power",
  description: "A considered space for technology, health, lifestyle, education, and travel.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}