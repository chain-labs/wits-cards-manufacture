"use client";

import useSkaleNebulaTestnet from "@/abi/SkaleNebulaTestnet";
import { buttonStates } from "@/app/Manufacutre";
import { Button } from "@/components/ui/button";
import { Skalatestnet_provider } from "@/constants";
import { useSelectedCardsTable } from "@/store";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
// import {
//   useAccount,
//   useWaitForTransactionReceipt,
//   useWriteContract,
// } from "wagmi";

export default function ManufacturingCards({
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
  // const {
  //   writeContractAsync: claimCards,
  //   data: hash,
  //   // error,
  //   // reset,
  // } = useWriteContract();

  // const { data: receipt } = useWaitForTransactionReceipt({
  //   hash: hash,
  // });
  const SkaleNebulaTestnet = useSkaleNebulaTestnet();

  const { generatingProofData } = useSelectedCardsTable() as {
    generatingProofData: {
      tree: { getHexProof: (leaf: string) => string[] };
      leaves: string[];
      cardInfos: unknown[];
      signatures: string[];
    };
  };

  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<unknown>();

  useEffect(() => {
    if (receipt) {
      settingActivePhaseButton("Allocate Tokens");
    }
  }, [receipt]);

  async function handleClaimCards() {
    setLoading(true);
    try {
      // TODO: change this to the receiver's address
      const receiver = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

      const provider = ethers.getDefaultProvider(Skalatestnet_provider);

      const userWalletWithProvider = new ethers.Wallet(privateKey, provider);

      const contract = new ethers.Contract(
        SkaleNebulaTestnet.address ?? "0x",
        SkaleNebulaTestnet.abi ?? [],
        userWalletWithProvider,
      );

      const proofs = generatingProofData.tree.getHexProof(
        generatingProofData.leaves[0],
      );
      const cardClaimArray = [generatingProofData.cardInfos[0]];
      const claimProofsArray = [proofs];
      const claimSignatureArray = [generatingProofData.signatures[0]];

      console.log({
        receiver,
        cardClaimArray,
        claimProofsArray,
        claimSignatureArray,
      });
      console.log("Working till here...");
      const claimTx = await contract.claimCards.send(
        receiver,
        cardClaimArray,
        claimProofsArray,
        claimSignatureArray,
        { gasLimit: 150000 },
      );
      console.log("Waiting for claiming cards trx with hash:", claimTx.hash);
      await claimTx.wait();
      console.log("Cards with token ID 1 claimed successfully");

      setReceipt(claimTx);
    } catch (err) {
      console.error({ err });
    }
    setLoading(false);
    /**
     * 
     *  generate signature
  const signaturePromises: Promise<BytesLike>[] = cardInfos.map(cardInfo => generateSignature(uc_name, uc_version, uc_chain_id, uc_address, cardInfo, pk1, ethers));
  const signatures = await Promise.all(signaturePromises);
     */
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
