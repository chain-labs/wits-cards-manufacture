"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Card } from "@/types";
import { Button as ShadButton } from "@/components/ui/button";
import useCards from "@/hooks/useCards";
import { useSelectedCardsTable } from "@/store";
import { SearchAndSelectCard } from "./SearchAndSelectCard";
import {
  getRarity,
  getRarityCode,
  Abstracttestnet_provider,
} from "@/constants";
import { ethers } from "ethers";
import useAbstractTestnet from "@/abi/AbstractTestnet";
// import UploadJsonFileData from "@/utils/UploadJsonFileData";
import DownloadJsonFileData from "@/utils/DownloadJsonFileData";

export default function GetCardData() {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [jsonFileStatus, setJsonFileStatus] = useState<boolean>(false);
  const {
    addCard,
    list,
    addCardInfo,
    assignedTokenId,
    setAssignedTokenId,
    upadteCardQuantity,
  } = useSelectedCardsTable();
  const cardsData = useCards();
  const AbstractTestnet = useAbstractTestnet();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCard === null) return;
    const currentQuantity =
      list.find((e) => e.id === selectedCard?.id)?.quantity ?? 0;
    setQuantity(currentQuantity);
  }, [selectedCard, list]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    setLoading(true);
    e.preventDefault();
    if (
      selectedCard === null ||
      quantity <= 0 ||
      assignedTokenId === undefined
    ) {
      return;
    }

    const rarity = getRarityCode(selectedCard.rarity as string);

    addCard({
      ...selectedCard,
      rarity,
      quantity,
    });

    for (let i = 1; i <= quantity; i++) {
      addCardInfo({
        name: selectedCard.tid,
        uniqueCode: selectedCard.id,
        rarity: getRarity(rarity),
        faction: selectedCard.team,
        assignedTokenId: assignedTokenId + BigInt(i),
      });
    }

    setSelectedCard(null);
    setQuantity(0);
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      if (assignedTokenId === undefined) {
        const provider = ethers.getDefaultProvider(Abstracttestnet_provider);

        const contract = new ethers.Contract(
          AbstractTestnet.address ?? "0x",
          AbstractTestnet.abi ?? [],
          provider,
        );

        const tokenId = await contract.currentTokenId();
        setAssignedTokenId(tokenId);
      }
    })();
  }, [
    AbstractTestnet.abi,
    AbstractTestnet.address,
    assignedTokenId,
    setAssignedTokenId,
  ]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex justify-center items-center gap-[24px]"
    >
      {/* upload file */}
      {/* <UploadJsonFileData
        jsonFileStatus={jsonFileStatus}
        setJsonFileStatus={setJsonFileStatus}
      /> */}

      {/* Download file */}
      <DownloadJsonFileData
        jsonFileStatus={jsonFileStatus}
        setJsonFileStatus={setJsonFileStatus}
      />

      {/* dropdown */}
      <SearchAndSelectCard
        list={cardsData}
        value={selectedCard}
        setValue={setSelectedCard}
        disabled={!jsonFileStatus}
      />

      {/* input quantity */}
      <Input
        type="number"
        placeholder="Quantity"
        className="w-[180px] bg-white"
        value={quantity}
        disabled={selectedCard === null}
        onChange={(e) => {
          if (
            e.target.value === "" ||
            e.target.valueAsNumber < 0 ||
            selectedCard === null
          ) {
            setQuantity(0);
            return;
          }
          setQuantity(parseInt(e.target.value, 10));
          const foundCard = list.find((e) => e.id === selectedCard.id);
          if (foundCard) {
            upadteCardQuantity(foundCard, parseInt(e.target.value, 10));
          }
        }}
      />

      {/* submit button */}
      <ShadButton
        type="submit"
        variant={loading ? "loading" : "default"}
        disabled={selectedCard === null || quantity <= 0 || loading}
      >
        Add Card
      </ShadButton>
    </form>
  );
}
