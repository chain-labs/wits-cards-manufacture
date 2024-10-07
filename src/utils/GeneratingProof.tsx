"use client";

import useSkaleNebulaTestnet from "@/abi/SkaleNebulaTestnet";
import { buttonStates } from "@/app/Manufacutre";
import { Button } from "@/components/ui/button";
import { useSelectedCardsTable } from "@/store";
import { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { MerkleTree } from "merkletreejs";
import { keccak256 } from "viem";
import { CardWithQuantity } from "@/types";

const buf2hex = (x: Buffer) => "0x" + x.toString("hex");

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
    writeContractAsync: updateMerkleRoot,
    data: hash,
    // error,
    // reset,
  } = useWriteContract();
  const { data: receipt } = useWaitForTransactionReceipt({
    hash: hash,
  });
  const SkaleNebulaTestnet = useSkaleNebulaTestnet();
  const {
    list: cardInfos,
    generatingProof,
    allocatingTokensData,
  } = useSelectedCardsTable() as {
    list: CardWithQuantity[];
    generatingProof: (data: unknown) => void;
    allocatingTokensData: { CARD_STRUCT_HASH: string };
  };
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
    try {
      const CARD_STRUCT_HASH = allocatingTokensData.CARD_STRUCT_HASH;
      const leaves = cardInfos.map((cardInfo) =>
        generateLeaf(cardInfo, CARD_STRUCT_HASH, ethers),
      );
      const tree = new MerkleTree(leaves, keccak256, { sort: true });

      const root = buf2hex(tree.getRoot());

      const proofs = await updateMerkleRoot({
        address: SkaleNebulaTestnet.address as `0x${string}`,
        abi: SkaleNebulaTestnet.abi || [],
        functionName: "updateMerkleRoot",
        args: [root],
      });

      generatingProof({ proofs });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
