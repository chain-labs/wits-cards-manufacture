import type { Metadata } from "next";
import "./globals.css";
import { beaufortPro } from "@/fonts";
import { cn } from "@/utils";
import "@rainbow-me/rainbowkit/styles.css";
import RainbowKitContext from "@/RainbowKit";
import { Toaster } from "react-hot-toast";

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
        <RainbowKitContext>
          <div id="modal" className="fixed z-50"></div>
          {children}
          <Toaster/>
        </RainbowKitContext>
      </body>
    </html>
  );
}
