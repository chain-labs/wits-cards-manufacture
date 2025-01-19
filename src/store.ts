"use client";

import { create } from "zustand";
import { CardWithQuantity } from "./types";

export type SelectedCardsTable = {
  count: number;
  list: CardWithQuantity[];
  addCard: (card: CardWithQuantity) => void;
  removeCard: (card: CardWithQuantity) => void;
  upadteCardQuantity: (card: CardWithQuantity, quantity: number) => void;
  disableUpdate: boolean;
  updateDisable: (value: boolean) => void;
  allocatingTokensData: unknown;
  allocatingTokens: (data: unknown) => void;
  generatingProofData: unknown;
  generatingProof: (data: unknown) => void;
  manufacturingCardsData: unknown;
  manufacturingCards: (data: unknown) => void;
};

export const useSelectedCardsTable = create<SelectedCardsTable>((set) => ({
  count: 0,
  list: [],
  addCard: (card: CardWithQuantity) => {
    set((state) => {
      if (state.disableUpdate) return state;
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
      if (state.disableUpdate) return state;
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
      if (state.disableUpdate) return state;
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
  disableUpdate: false,
  updateDisable: (value) => {
    set(() => ({
      disableUpdate: value,
    }));
  },
  allocatingTokensData: undefined,
  allocatingTokens: (data) => {
    set(() => ({
      allocatingTokensData: data,
    }));
  },
  generatingProofData: undefined,
  generatingProof: (data) => {
    set(() => ({
      generatingProofData: data,
    }));
  },
  manufacturingCardsData: undefined,
  manufacturingCards: (data) => {
    set(() => ({
      manufacturingCardsData: data,
    }));
  },
}));
