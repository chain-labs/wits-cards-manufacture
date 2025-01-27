import { Input } from "@/components/ui/input";
import { useJSONCards } from "@/store";
import useCards from "@/hooks/useCards";
import { CardInfo } from "@/types";
import React, { useState } from "react";

interface ClaimData {
  data: {
    cardHash: string;
    cardInfo: CardInfo;
  }[];
  claimLinks: string[];
}

interface JsonData {
  // Define your expected data structure here
  [key: string]: ClaimData;
}

export default function UploadJsonFileData({
  jsonFileStatus,
  setJsonFileStatus,
}: {
  jsonFileStatus: boolean;
  setJsonFileStatus: (status: boolean) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const { addJSONCardInfo, addJSONCard, updateJSONCardQuantity } =
    useJSONCards();
  const cardsData = useCards();

  const validateJsonFormat = (data: unknown): data is JsonData => {
    if (typeof data !== "object" || data === null) return false;

    console.log("item");
    for (const key in data as Record<string, unknown>) {
      const item = (data as Record<string, unknown>)[key];

      console.log("item", item);

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
    for (const key in jsonData) {
      const item = jsonData[key] as ClaimData;
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
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsedData = JSON.parse(e.target?.result as string);
        if (validateJsonFormat(parsedData)) {
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
    reader.readAsText(file);
  };

  return (
    <div>
      <Input
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        className="w-[180px] bg-white"
        disabled={jsonFileStatus}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
