"use client";

import useSkaleNebulaTestnet from "@/abi/SkaleNebulaTestnet";
import { buttonStates } from "@/app/Manufacutre";
import { Button } from "@/components/ui/button";
import { useSelectedCardsTable } from "@/store";
import { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export default function GeneratingProof({
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
  const { count: cardsCount } = useSelectedCardsTable();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("hash", hash);
  }, [hash]);

  useEffect(() => {
    if (receipt) {
      settingActivePhaseButton("Allocate Tokens");
    }
  }, [receipt]);

  async function handleGenerateProof() {
    setLoading(true);
    await allocateTokens({
      address: SkaleNebulaTestnet.address as `0x${string}`,
      abi: SkaleNebulaTestnet.abi || [],
      functionName: "allocateTokens",
      args: [cardsCount],
    });
    setLoading(false);
  }

  return (
    <Button
      type="button"
      disabled={state["Generate Proof"].disabled || loading}
      variant={
        state["Generate Proof"].success
          ? "success"
          : loading
          ? "loading"
          : "default"
      }
      onClick={handleGenerateProof}
    >
      Generate Proof
    </Button>
  );
}
