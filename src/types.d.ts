export type Rarity = "common" | "uncommon" | "rare" | "mythical" | "legendary";

export interface Card {
  id: number;
  tid: string;
  type: string;
  alliance: string;
  rarity: Rarity;
  mana: number;
  attack: number;
  hp: number;
  cost: number;
  packs: string[];
  team: string;
  supply: number;
}

export type CardWithQuantity = {
  quantity: number;
} & Card;
