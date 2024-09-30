"use client";

// import Header from "@/components/Header";
import { IMAGEKIT_BG } from "@/images";
import { cn } from "@/utils";
import Button from "@/components/Button";
import { useSelectedCardsTable } from "@/store";
import GetCardData from "@/components/GetCardData";
import TableWithCardData from "@/components/TableWithCardData";
import { useState } from "react";
import Manufacutre from "./Manufacutre";

type States = "selection" | "manufacture" | "idle";

export default function Home() {
  const { count } = useSelectedCardsTable();
  const [state, setState] = useState<States>("selection");
  return (
    <div
      style={{
        backgroundImage: `url(${IMAGEKIT_BG.CRAFT})`,
      }}
      className={cn(
        "w-full h-screen bg-cover",
        "flex flex-col items-center justify-center gap-[50px]",
        "px-[16px]",
      )}
    >
      {
        {
          selection: (
            <>
              <GetCardData />
              <Button
                disabled={count <= 0}
                onClick={() => {
                  setState("manufacture");
                }}
              >
                Manufacture
              </Button>
            </>
          ),
          manufacture: <Manufacutre />,
          idle: <></>,
        }[state]
      }
      <TableWithCardData />
    </div>
  );
}
