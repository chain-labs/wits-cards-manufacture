"use client";

import { create } from "zustand";
import { CardInfo, CardWithQuantity } from "./types";

export type SelectedCardsTable = {
  count: number;
  assignedTokenId: bigint | undefined;
  list: CardWithQuantity[];
  cards: CardInfo[];
  setAssignedTokenId: (id: bigint) => void;
  addCard: (card: CardWithQuantity) => void;
  addCardInfo: (card: CardInfo) => void;
  removeCard: (card: CardWithQuantity) => void;
  upadteCardQuantity: (card: CardWithQuantity, quantity: number) => void;
  clearAllListAndCards: () => void;
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
  assignedTokenId: undefined,
  list: [],
  cards: [],
  setAssignedTokenId: (id: bigint) => {
    if (id === undefined) return;
    set((state) => {
      if (state.assignedTokenId !== undefined) return state;
      return {
        ...state,
        assignedTokenId: id,
      };
    });
  },
  addCard: (card: CardWithQuantity) => {
    set((state) => {
      if (state.disableUpdate) return state;
      const isCardInTheList = state.list.some((c) => c.id === card.id);
      if (isCardInTheList === false) {
        return {
          count: state.count + card.quantity,
          list: [...state.list, card],
        };
      }
      return state;
    });
  },
  addCardInfo: (card) => {
    set((state) => {
      const isCardInTheList = state.cards.some(
        (c) => c.assignedTokenId === card.assignedTokenId,
      );
      if (state.assignedTokenId === undefined) return state;
      if (isCardInTheList === false) {
        return {
          ...state,
          assignedTokenId: state.assignedTokenId + BigInt(1),
          cards: [...state.cards, card],
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
        const updatedCards = state.cards.filter(
          (c) => c.uniqueCode !== card.id,
        );

        const list = [...state.list];
        list.splice(cardIndex, 1);
        return {
          count: state.count - 1,
          list,
          cards: updatedCards,
          assignedTokenId:
            (state.assignedTokenId as bigint) - BigInt(card.quantity),
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
        const previousQuantity = state.list[cardIndex].quantity;

        if (quantity < 1) return state;
        if (previousQuantity === quantity) return state;

        if (state.assignedTokenId === undefined) return state;

        let updatedCards = [];
        let updatedAssignedTokenId = state.assignedTokenId;

        // Add new cards
        if (previousQuantity < quantity) {
          const getAllTheCardWithTheSameId = state.cards.find(
            (c) => c.uniqueCode === card.id,
          );
          if (getAllTheCardWithTheSameId === undefined) return state;

          const extraQuantity = quantity - previousQuantity;
          updatedCards = [
            ...state.cards,
            ...Array.from({ length: extraQuantity }, () => {
              updatedAssignedTokenId = updatedAssignedTokenId + BigInt(1);
              return {
                ...getAllTheCardWithTheSameId,
                assignedTokenId: updatedAssignedTokenId,
              };
            }),
          ];
        }

        // Remove cards
        else {
          const getAllTheCardsWithTheSameId = state.cards.filter(
            (c) => c.uniqueCode === card.id,
          );
          const getAllTheCardsWithTheWithoutSameId = state.cards.filter(
            (c) => c.uniqueCode !== card.id,
          );
          updatedCards = [
            ...getAllTheCardsWithTheWithoutSameId,
            ...getAllTheCardsWithTheSameId.splice(0, quantity),
          ];

          updatedAssignedTokenId -= BigInt(previousQuantity - quantity);
        }

        const list = [...state.list];
        list[cardIndex] = { ...card, quantity };

        return {
          count: state.cards.length,
          list,
          cards: updatedCards,
          assignedTokenId: updatedAssignedTokenId,
        };
      }
      return state;
    });
  },
  clearAllListAndCards: () => {
    set(() => ({
      count: 0,
      list: [],
      cards: [],
    }));
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

export interface ClaimData {
  data: {
    cardHash: string;
    cardInfo: CardInfo;
  }[];
  claimLinks: string[];
}

export interface JsonData {
  // Define your expected data structure here
  [key: string]: ClaimData;
}

type JSONCardsState = {
  jsonCardsCount: number;
  jsonCards: CardWithQuantity[];
  jsonCardsInfo: CardInfo[];
  rawJSONdata: JsonData;
  addJSONCardInfo: (card: CardInfo) => void;
  addJSONCard: (card: CardWithQuantity) => void;
  updateJSONCardQuantity: (card: CardWithQuantity, quantity: number) => void;
  updateRawJSONData: (data: JsonData) => void;
};

export const useJSONCards = create<JSONCardsState>((set) => ({
  jsonCardsCount: 0,
  jsonCards: [],
  jsonCardsInfo: [],
  rawJSONdata: {},
  addJSONCardInfo: (card) => {
    set((state) => ({
      jsonCardsInfo: [...state.jsonCardsInfo, card],
      jsonCardsCount: state.jsonCardsCount + 1,
    }));
  },
  addJSONCard: (card) => {
    set((state) => {
      const exists = state.jsonCards.some((c) => c.id === card.id);
      if (!exists) {
        return {
          jsonCards: [...state.jsonCards, card],
          jsonCardsCount: state.jsonCardsCount + card.quantity,
        };
      }
      return state;
    });
  },
  updateJSONCardQuantity: (card, quantity) => {
    set((state) => {
      const cardIndex = state.jsonCards.findIndex((c) => c.id === card.id);
      if (cardIndex !== -1 && quantity >= 1) {
        const updatedCards = [...state.jsonCards];
        updatedCards[cardIndex] = { ...card, quantity };
        return {
          jsonCards: updatedCards,
          jsonCardsCount: state.jsonCardsCount + quantity - card.quantity,
        };
      }
      return state;
    });
  },
  updateRawJSONData: (data) => {
    set(() => ({
      rawJSONdata: data,
    }));
  },
}));
