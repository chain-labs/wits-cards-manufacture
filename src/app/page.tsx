"use client";

// import Header from "@/components/Header";
import { IMAGEKIT_BG } from "@/images";
import { cn } from "@/utils";
import Button from "@/components/Button";
import { useSelectedCardsTable } from "@/store";
import GetCardData from "@/components/GetCardData";
import TableWithCardData from "@/components/TableWithCardData";
import { useEffect, useState } from "react";
import Manufacutre from "./Manufacutre";
import Idle from "./Idle";

type States = "selection" | "manufacture" | "idle";

export default function Home() {
  const { count } = useSelectedCardsTable();
  const [state, setState] = useState<States>("idle");

  useEffect(() => {
    if (count === 0) {
      setState("selection");
    }
  }, [count]);

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
          manufacture: <Manufacutre changeState={() => setState("idle")} />,
          idle: <Idle resetStates={() => setState("selection")} />,
        }[state]
      }
      {state !== "idle" && <TableWithCardData />}
    </div>
  );
}
