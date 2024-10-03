"use client";

import useSkaleNebulaTestnet from "@/abi/SkaleNebulaTestnet";
import { buttonStates } from "@/app/Manufacutre";
import { Button } from "@/components/ui/button";
import { useSelectedCardsTable } from "@/store";
import { useEffect } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export default function AllocatingTokens({
  state,
  settingActivePhaseButton,
}: {
  state: Record<
    buttonStates,
    {
      active: boolean;
      disabled: boolean;
      success: boolean;
    }
  >;
  settingActivePhaseButton: (button: buttonStates) => void;
}) {
  const {
    writeContractAsync: allocateTokens,
    data: hash,
    // error,
    // reset,
  } = useWriteContract();
  const { data: receipt } = useWaitForTransactionReceipt({
    hash: hash,
  });
  const SkaleNebulaTestnet = useSkaleNebulaTestnet();
  const { count } = useSelectedCardsTable();

  useEffect(() => {
    console.log("hash", hash);
  }, [hash]);

  useEffect(() => {
    if (receipt) {
      settingActivePhaseButton("Allocate Tokens");
    }
  }, [receipt]);

  return (
    <Button
      type="button"
      disabled={state["Allocate Tokens"].disabled}
      variant={state["Allocate Tokens"].success ? "success" : "default"}
      onClick={() => {
        allocateTokens({
          address: SkaleNebulaTestnet.address as `0x${string}`,
          abi: SkaleNebulaTestnet.abi || [],
          functionName: "allocateTokens",
          args: [count],
        });
      }}
    >
      Allocate Tokens
    </Button>
  );
}
