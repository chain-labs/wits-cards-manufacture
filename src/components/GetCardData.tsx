// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Card } from "@/types";
import { Button as ShadButton } from "@/components/ui/button";
import useCards from "@/hooks/useCards";
import { useSelectedCardsTable } from "@/store";
import { SearchAndSelectCard } from "./SearchAndSelectCard";

export default function GetCardData() {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const { addCard, list } = useSelectedCardsTable();
  const cardsData = useCards();
  const [UnselectedCards, setUnselectedCards] = useState<Card[]>(cardsData);

  useEffect(() => {
    setUnselectedCards(
      cardsData.filter((card) => {
        return list.every((selectedCard) => selectedCard.id !== card.id);
      }),
    );
  }, [cardsData, list]);

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
      <SearchAndSelectCard
        list={UnselectedCards}
        value={selectedCard}
        setValue={setSelectedCard}
      />
      
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
