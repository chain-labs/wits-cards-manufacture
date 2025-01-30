"use client";

import { Card } from "@/types";
import { useEffect, useState } from "react";

let cardsCache: Card[] = [];

export default function useCards() {
  const [cards, setCards] = useState<Card[]>([]);
  useEffect(() => {
    if (cardsCache.length) {
      setCards(cardsCache);
      return;
    }
    fetch("https://api.wits.academy/cards")
      .then((res) => res.json())
      .then((data) => {
        cardsCache = data;
        setCards(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return cards;
}
