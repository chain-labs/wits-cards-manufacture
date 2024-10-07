"use client";

import useSkaleNebulaTestnet from "@/abi/SkaleNebulaTestnet";
import { buttonStates } from "@/app/Manufacutre";
import { Button } from "@/components/ui/button";
import { useSelectedCardsTable } from "@/store";
import { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export default function AllocatingTokens({
  state,
  settingActivePhaseButton,
  privateKey,
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
  privateKey: `0x${string}`;
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
  const { count: cardsCount, allocatingTokens } = useSelectedCardsTable();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("hash", hash);
  }, [hash]);

  useEffect(() => {
    if (receipt) {
      settingActivePhaseButton("Allocate Tokens");
    }
  }, [receipt]);

  async function handleAllocateTokens() {
    setLoading(true);
    try {
      const tokensData = await allocateTokens({
        address: SkaleNebulaTestnet.address as `0x${string}`,
        abi: SkaleNebulaTestnet.abi || [],
        functionName: "allocateTokens",
        args: [cardsCount],
        account: privateKey,
      });
      allocatingTokens(tokensData);
    } catch (err) {
      console.log({ err });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      disabled={state["Allocate Tokens"].disabled || loading}
      variant={
        state["Allocate Tokens"].success
          ? "success"
          : loading
          ? "loading"
          : "default"
      }
      onClick={handleAllocateTokens}
    >
      Allocate Tokens
    </Button>
  );
}
