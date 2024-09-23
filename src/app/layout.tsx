import type { Metadata } from "next";
import "./globals.css";
import { beaufortPro } from "@/fonts";
import { cn } from "@/utils";

export const metadata: Metadata = {
  title: "WITS Idle Game",
  description: "This is the WITS Idle Game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(beaufortPro.className, "bg-black")}>
        <div id="modal" className="fixed z-50"></div>
        {children}
      </body>
    </html>
  );
}
