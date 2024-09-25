"use client";

import { create } from "zustand";
import { CardWithQuantity } from "./types";

type SelectedCardsTable = {
  count: number;
  list: CardWithQuantity[];
  addCard: (card: CardWithQuantity) => void;
  removeCard: (card: CardWithQuantity) => void;
  upadteCardQuantity: (card: CardWithQuantity, quantity: number) => void;
};

export const useSelectedCardsTable = create<SelectedCardsTable>((set) => ({
  count: 0,
  list: [],
  addCard: (card: CardWithQuantity) => {
    set((state) => {
      const isCardInTheList = state.list.some((c) => c.id === card.id);
      if (isCardInTheList === false) {
        return {
          count: state.count + 1,
          list: [...state.list, card],
        };
      }
      return state;
    });
  },
  removeCard: (card) => {
    set((state) => {
      const cardIndex = state.list.findIndex((c) => c.id === card.id);
      if (cardIndex !== -1) {
        const list = [...state.list];
        list.splice(cardIndex, 1);
        return {
          count: state.count - 1,
          list,
        };
      }
      return state;
    });
  },
  upadteCardQuantity: (card, quantity) => {
    set((state) => {
      const cardIndex = state.list.findIndex((c) => c.id === card.id);
      if (cardIndex !== -1) {
        const list = [...state.list];
        list[cardIndex] = { ...card, quantity };
        return {
          count: state.count,
          list,
        };
      }
      return state;
    });
  },
}));
