"use client";

import useSkaleNebulaTestnet from "@/abi/SkaleNebulaTestnet";
import { buttonStates } from "@/app/Manufacutre";
import { Button } from "@/components/ui/button";
import { useSelectedCardsTable } from "@/store";
import { useEffect, useState } from "react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

export default function ManufacturingCards({
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
    writeContractAsync: claimCards,
    data: hash,
    // error,
    // reset,
  } = useWriteContract();

  const { data: receipt } = useWaitForTransactionReceipt({
    hash: hash,
  });
  const SkaleNebulaTestnet = useSkaleNebulaTestnet();

  const { list: cardClaimArray, generatingProofData } = useSelectedCardsTable();

  const [loading, setLoading] = useState(false);

  const receiver = useAccount();

  useEffect(() => {
    console.log("hash", hash);
  }, [hash]);

  useEffect(() => {
    if (receipt) {
      settingActivePhaseButton("Allocate Tokens");
    }
  }, [receipt]);

  async function handleClaimCards() {
    setLoading(true);
    try {
      const claimTx = await claimCards({
        address: SkaleNebulaTestnet.address as `0x${string}`,
        abi: SkaleNebulaTestnet.abi || [],
        functionName: "claimCards",
        args: [
          receiver.address,
          cardClaimArray,
          generatingProofData.proof,
          generatingProofData.signature,
        ],
      });
      console.log('claimTx', claimTx);
    } catch (err) {
      console.error({ err });
    }
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
      onClick={handleClaimCards}
    >
      Manufacting Cards
    </Button>
  );
}
