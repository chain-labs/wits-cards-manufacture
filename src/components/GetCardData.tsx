import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Card } from "@/types";
import { Button as ShadButton } from "@/components/ui/button";
import useCards from "@/hooks/useCards";
import { useSelectedCardsTable } from "@/store";

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
      })
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
      <Select
        onValueChange={(value) => {
          const card = UnselectedCards.find((item) => String(item.id) === value);
          if (card) {
            setSelectedCard(card);
          }
        }}
        value={String(selectedCard?.id)}
      >
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="Choose A Card" />
        </SelectTrigger>
        <SelectContent>
          {UnselectedCards.map((item) => (
            <SelectItem key={item.id} value={String(item.id)}>
              {item.tid} (id: {item.tid})
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
