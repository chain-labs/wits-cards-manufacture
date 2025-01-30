import { Button } from "@/components/ui/button";
import useCards from "@/hooks/useCards";
import { ClaimData, JsonData, useJSONCards } from "@/store";
import { useState } from "react";
import { abstractTestnet } from "viem/chains";

export default function DownloadJsonFileData({
  jsonFileStatus,
  setJsonFileStatus,
}: {
  jsonFileStatus: boolean;
  setJsonFileStatus: (status: boolean) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const {
    addJSONCardInfo,
    addJSONCard,
    updateJSONCardQuantity,
    updateRawJSONData,
  } = useJSONCards();
  const cardsData = useCards();
  const chainId = abstractTestnet.id;

  const validateJsonFormat = (data: unknown): data is JsonData => {
    if (typeof data !== "object" || data === null) return false;

    for (const key in data as Record<string, unknown>) {
      const item = (data as Record<string, unknown>)[key];

      const typedItem = item as { data: unknown; claimLinks: unknown };
      if (!typedItem.data || !Array.isArray(typedItem.data)) return false;
      if (!typedItem.claimLinks || !Array.isArray(typedItem.claimLinks))
        return false;

      for (const entry of typedItem.data) {
        if (typeof entry.cardHash !== "string") return false;
        if (!entry.cardInfo || typeof entry.cardInfo !== "object") return false;
      }
    }

    return true;
  };

  const handleCardsUpload = (jsonData: JsonData) => {
    if (!jsonData) return;
    const item = jsonData[chainId] as ClaimData;
    const quantityHashTable: Record<string, number> = {};
    for (const entry of item.data) {
      addJSONCardInfo(entry.cardInfo);
      // if card already exists in the list, update the quantity
      const foundCard = cardsData.find(
        (c) => c.id === entry.cardInfo.uniqueCode,
      );
      if (quantityHashTable[entry.cardInfo.name] !== undefined && foundCard) {
        updateJSONCardQuantity(
          { ...foundCard, quantity: quantityHashTable[entry.cardInfo.name] },
          quantityHashTable[entry.cardInfo.name] + 1,
        );
        quantityHashTable[entry.cardInfo.name] += 1;
      } else {
        if (foundCard) {
          addJSONCard({
            quantity: 1,
            ...foundCard,
          });
          quantityHashTable[entry.cardInfo.name] = 1;
        }
      }
    }
  };

  const handleFileDownload = async () => {
    try {
      const response = await fetch("https://wits.b-cdn.net/claimCards.json");
      const parsedData = await response.json();
      console.log("parsedData---", parsedData);
      if (validateJsonFormat(parsedData)) {
        console.log("parsed", parsedData);
        updateRawJSONData(parsedData);
        handleCardsUpload(parsedData);
        setError(null);
        setJsonFileStatus(true);
      } else {
        setError("Invalid JSON format");
        setJsonFileStatus(false);
      }
    } catch {
      setError("Failed to parse JSON file");
      setJsonFileStatus(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleFileDownload}
      disabled={error !== null || jsonFileStatus}
    >
      Download File
    </Button>
  );
}
