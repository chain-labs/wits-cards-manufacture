"use client";

import { cn } from "@/utils";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Manufacutre() {
  return (
    <div
      className={cn(
        "w-full h-screen bg-cover",
        "flex flex-col items-center justify-center gap-[50px]",
        "px-[16px]",
      )}
    >
      <ConnectButton />
    </div>
  );
}
