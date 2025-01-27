export interface Card {
  id: number;
  tid: string;
  type: string;
  alliance: string;
  rarity: number | string;
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

export type CardInfo = {
  assignedTokenId: number | bigint;
  uniqueCode: number | bigint;
  rarity: number | bigint | string;
  name: string;
  faction: string;
};
