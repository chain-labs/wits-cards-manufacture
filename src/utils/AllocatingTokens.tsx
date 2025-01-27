"use client";

import useAbstractTestnet from "@/abi/AbstractTestnet";
import { buttonStates } from "@/app/Manufacutre";
import { Button } from "@/components/ui/button";
import { useJSONCards, useSelectedCardsTable } from "@/store";
import { useEffect, useState } from "react";
// import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { ethers } from "ethers";
import { Abstracttestnet_provider } from "@/constants";
import toast from "react-hot-toast";

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
  // const { writeContractAsync: allocateTokens, data: hash } = useWriteContract();
  // const { data: receipt } = useWaitForTransactionReceipt({
  //   hash: hash,
  // });
  const AbstractTestnet = useAbstractTestnet();
  const { count: cardsCount, allocatingTokens } = useSelectedCardsTable();
  const { jsonCardsCount } = useJSONCards();
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState();

  useEffect(() => {
    if (receipt) {
      toast.success("Tokens allocated successfully");
      settingActivePhaseButton("Generate Proof");
      allocatingTokens(receipt);
    }
  }, [receipt]);

  async function handleAllocateTokens() {
    setLoading(true);
    try {
      // const tokensData = await allocateTokens({
      //   address: AbstractTestnet.address as `0x${string}`,
      //   abi: AbstractTestnet.abi || [],
      //   functionName: "allocateTokens",
      //   args: [cardsCount],
      //   account: privateKey,
      // });
      // allocatingTokens(tokensData);

      const provider = ethers.getDefaultProvider(Abstracttestnet_provider);

      const userWalletWithProvider = new ethers.Wallet(privateKey, provider);

      const contract = new ethers.Contract(
        AbstractTestnet.address ?? "0x",
        AbstractTestnet.abi ?? [],
        userWalletWithProvider,
      );

      console.log("allocating tokens...");
      const tx = await contract.allocateTokens(cardsCount + jsonCardsCount);
      console.log("Waiting for Allocating tokens trx with hash:", tx);
      const receipt = await tx.wait();
      console.log("Tokens allocated successfully", receipt);
      setReceipt(receipt);
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
