"use client";

import useSkaleNebulaTestnet from "@/abi/AbstractTestnet";
import { buttonStates } from "@/app/Manufacutre";
import { Button } from "@/components/ui/button";
import { JsonData, useJSONCards, useSelectedCardsTable } from "@/store";
import { useEffect, useState } from "react";
// import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { MerkleTree } from "merkletreejs";
import { keccak256 } from "viem";
import { CardInfo } from "@/types";
import { BytesLike, ethers } from "ethers";
import { getRarityCode, Abstracttestnet_provider } from "@/constants";
import toast from "react-hot-toast";
import { abstractTestnet } from "viem/chains";

const buf2hex = (x: Buffer) => "0x" + x.toString("hex");

function ascii_to_hexa(str: string) {
  // Initialize an empty array to store the hexadecimal values
  const arr1 = [];

  // Iterate through each character in the input string
  for (let n = 0, l = str.length; n < l; n++) {
    // Convert the ASCII value of the current character to its hexadecimal representation
    const hex = Number(str.charCodeAt(n)).toString(16);

    // Push the hexadecimal value to the array
    arr1.push(hex);
  }

  // Join the hexadecimal values in the array to form a single string
  return arr1.join("");
}

function generateLeaf(card: CardInfo, CARD_STRUCT_HASH: string) {
  console.log("card", card);
  return keccak256(
    // @ts-expect-error - The types are not correct
    ethers.AbiCoder.defaultAbiCoder().encode(
      ["bytes32", "uint256", "uint256", "uint8", "bytes32", "bytes32"],
      [
        CARD_STRUCT_HASH,
        card.assignedTokenId,
        card.uniqueCode,
        getRarityCode(card.rarity as string),
        keccak256(`0x${ascii_to_hexa(card.name)}`),
        keccak256(`0x${ascii_to_hexa(card.faction)}`),
      ],
    ),
  );
}

async function generateSignature(
  UC_NAME: string,
  UC_VERSION: string,
  UC_CHAIN_ID: bigint,
  ucAddress: `0x${string}`,
  card: CardInfo,
  signer: unknown,
): Promise<BytesLike> {
  const TYPED_DATA = {
    types: {
      CardInfo: [
        { name: "assignedTokenId", type: "uint256" },
        { name: "uniqueCode", type: "uint16" },
        { name: "rarity", type: "uint8" },
        { name: "name", type: "string" },
        { name: "faction", type: "string" },
      ],
    },
    primaryType: "CardInfo",
    domain: {
      name: UC_NAME,
      version: UC_VERSION,
      chainId: UC_CHAIN_ID,
      verifyingContract: ucAddress,
    },
    message: {
      assignedTokenId: card.assignedTokenId,
      uniqueCode: card.uniqueCode,
      rarity: getRarityCode(card.rarity as string),
      name: card.name,
      faction: card.faction,
    },
  };
  console.log(TYPED_DATA);
  // @ts-expect-error - The types are not correct
  const signature = await signer.signTypedData(
    TYPED_DATA.domain,
    TYPED_DATA.types,
    TYPED_DATA.message,
  );
  console.log({
    recoveredAddress: ethers.verifyTypedData(
      TYPED_DATA.domain,
      TYPED_DATA.types,
      TYPED_DATA.message,
      signature,
    ),
  });
  console.log({
    domain: ethers.TypedDataEncoder.hashDomain(TYPED_DATA.domain),
  });
  console.log({
    domain: ethers.TypedDataEncoder.hashStruct(
      TYPED_DATA.primaryType,
      TYPED_DATA.types,
      TYPED_DATA.message,
    ),
  });
  console.log({
    digest: ethers.TypedDataEncoder.hash(
      TYPED_DATA.domain,
      TYPED_DATA.types,
      TYPED_DATA.message,
    ),
  });
  return signature;
}

function saveArraysToJSON(
  chainId: number,
  array1: unknown[],
  array2: unknown[],
  rawJSONdata: JsonData,
  updateRawJSONData: (data: JsonData) => void,
): void {
  const data = {
    ...rawJSONdata,
    [parseInt(chainId.toString())]: {
      data: array1,
      claimLinks: array2,
    },
  };

  updateRawJSONData(data);
  console.log(data);

  // fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  // store in local storage with BigInt handling
  localStorage.setItem(
    "claimCards",
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );
}

/**
 * Generates a proof for the selected cards and updates the Merkle root on the blockchain.
 *
 * @param {Object} props - The properties object.
 * @param {Record<buttonStates, { active: boolean; disabled: boolean; success: boolean }>} props.state - The state of the buttons.
 * @param {(button: buttonStates) => void} props.settingActivePhaseButton - Function to set the active phase button.
 * @param {`0x${string}`} props.privateKey - The private key of the user.
 *
 * @returns {JSX.Element} The JSX element for the Generate Proof button.
 */
export default function GeneratingProof({
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
  // State and hooks initialization
  const SkaleNebulaTestnet = useSkaleNebulaTestnet();
  const {
    cards: cardInfosFromStore,
    generatingProof,
    allocatingTokensData,
  } = useSelectedCardsTable() as {
    cards: CardInfo[];
    generatingProof: (data: unknown) => void;
    allocatingTokensData: { hash: string };
  };
  const { jsonCardsInfo, rawJSONdata, updateRawJSONData } = useJSONCards();
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<unknown>();

  // Effect to set the active phase button when receipt is available
  useEffect(() => {
    if (receipt) {
      toast.success("Proof generated successfully");
      settingActivePhaseButton("Uploading");
    }
  }, [receipt]);

  /**
   * Handles the generation of the proof and updates the Merkle root on the blockchain.
   */
  async function handleGenerateProof() {
    setLoading(true);
    try {
      // necessary to add previous data to the tree
      const cardInfos = jsonCardsInfo.concat(cardInfosFromStore);

      const provider = ethers.getDefaultProvider(Abstracttestnet_provider);
      console.log("provider", provider);

      const userWalletWithProvider = new ethers.Wallet(privateKey, provider);

      const contract = new ethers.Contract(
        SkaleNebulaTestnet.address ?? "0x",
        SkaleNebulaTestnet.abi ?? [],
        userWalletWithProvider,
      );

      const CARD_STRUCT_HASH = allocatingTokensData.hash;
      console.log("CARD_STRUCT_HASH", CARD_STRUCT_HASH);

      console.log("cardInfos", cardInfos);

      // TODO: add previous proof to the tree
      const leaves = cardInfos.map((cardInfo) =>
        generateLeaf(cardInfo, CARD_STRUCT_HASH),
      );

      console.log("leaves", leaves);

      const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

      const root = buf2hex(tree.getRoot());

      // Update Merkle root on the blockchain
      console.log("Updating merkle root...");
      const rootTx = await contract.updateMerkleRoot(root);
      console.log(
        "Waiting for Updating merkle root trx with hash:",
        rootTx.hash,
      );
      await rootTx.wait();
      console.log("Merkle root updated successfully");

      console.log({ root });
      console.log({ firstLeave: leaves[0] });

      // Get domain information
      const uc_name = await contract._NAME();
      const uc_version = await contract._VERSION();
      const uc_address = await contract.getAddress();
      const uc_chain_id = abstractTestnet.id;

      // Generate signatures for each card
      const signaturePromises: Promise<BytesLike>[] = cardInfos.map(
        (cardInfo) =>
          generateSignature(
            uc_name,
            uc_version,
            BigInt(uc_chain_id),
            uc_address as `0x${string}`,
            cardInfo,
            userWalletWithProvider,
          ),
      );
      const signatures = await Promise.all(signaturePromises);

      generatingProof({
        tree,
        leaves,
        signatures,
        cardInfos,
      });

      const data = [];
      const links = [];

      // Prepare data and links for each card
      for (let i = 0; i < cardInfos.length; i++) {
        data.push({
          cardHash: leaves[i],
          cardInfo: cardInfos[i],
        });
        links.push(
          `/claim?cardHash=${encodeURIComponent(
            leaves[i],
          )}&signature=${encodeURIComponent(signatures[i].toString())}`,
        );
      }

      console.log(uc_chain_id, data, links);

      // Save data and links to JSON
      saveArraysToJSON(
        uc_chain_id,
        data,
        links,
        rawJSONdata,
        updateRawJSONData,
      );

      setReceipt(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Render the Generate Proof button
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
