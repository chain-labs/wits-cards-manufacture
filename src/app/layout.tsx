import type { Metadata } from "next";
import "./globals.css";
import { beaufortPro } from "@/fonts";
import { cn } from "@/utils";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "WITS Manufacturing",
  description: "This is the WITS Manufacturing Site",
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
        <Toaster />
      </body>
    </html>
  );
}
