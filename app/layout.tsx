import "./globals.css";
import { ReactNode } from "react";
import { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MailMuse | Email Writing Agent",
  description:
    "Draft polished emails instantly with MailMuse, a smart agent that adapts tone, intent, and key points to your needs."
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="min-h-full bg-slate-950 text-slate-100">
      <body className={inter.className}>
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
