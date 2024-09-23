"use client";

// import Header from "@/components/Header";
import { IMAGEKIT_BG } from "@/images";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/utils";
import { dummydata } from "@/dummydata";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Card } from "@/types";
import Button from "@/components/Button";
import { Button as ShadButton } from "@/components/ui/button";
import { useSelectedCardsTable } from "@/store";
import { DataTable } from "@/components/DataTable";
import { columns } from "@/components/TableColumn";

function GetCardData() {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const { addCard } = useSelectedCardsTable();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (selectedCard === null || quantity <= 0) {
      return;
    }

    addCard({
      ...selectedCard,
      quantity,
    });

    setSelectedCard(null);
    setQuantity(0);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex justify-center items-center gap-[24px]"
    >
      {/* dropdown */}
      <Select
        onValueChange={(value) => {
          const card = dummydata.find((item) => item.tokenId === value);
          if (card) {
            setSelectedCard(card);
          }
        }}
        value={selectedCard?.tokenId}
      >
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="Choose A Card" />
        </SelectTrigger>
        <SelectContent>
          {dummydata.map((item) => (
            <SelectItem key={item.tokenId} value={item.tokenId}>
              {item.name} (id: {item.tokenId})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* input quantity */}

      <Input
        type="number"
        placeholder="Quantity"
        className="w-[180px] bg-white"
        value={quantity}
        disabled={selectedCard === null}
        onChange={(e) => {
          if (e.target.value === "" || e.target.valueAsNumber < 0) {
            setQuantity(0);
            return;
          }
          setQuantity(parseInt(e.target.value, 10));
        }}
      />

      {/* submit button */}
      <ShadButton
        type="submit"
        disabled={selectedCard === null || quantity <= 0}
      >
        Add Card
      </ShadButton>
    </form>
  );
}

export default function Home() {
  const { list, count } = useSelectedCardsTable();
  console.log("list", count);
  return (
    <div
      style={{
        backgroundImage: `url(${IMAGEKIT_BG.CRAFT})`,
      }}
      className={cn(
        "w-full h-screen bg-cover",
        "flex flex-col items-center justify-center gap-[50px]",
        "px-[16px]",
      )}
    >
      {/* <Header /> */}
      <GetCardData />
      <DataTable columns={columns} data={list} />
      <Button type="submit" disabled={count <= 0}>
        Manufacture
      </Button>
    </div>
  );
}
