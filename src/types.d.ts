export type Rarity = "common" | "uncommon" | "rare" | "mythical" | "legendary";

export interface Card {
  name: string;
  rarity: Rarity;
  tokenId: string;
}

export type CardWithQuantity = {
  quantity: number;
} & Card;
