export const IMAGEKIT = "https://ik.imagekit.io/qvs5pk2dl/Wits-Idle";

export const PROJECT_ID = "9dc0f8c0aa31f9c7fdd6f5e46978aa16";

export const Abstracttestnet_provider = "https://api.testnet.abs.xyz";

export const Rarity = {
  NO_RARITY: 0,
  COMMON: 1,
  UNCOMMON: 2,
  RARE: 3,
  ULTRA_RARE: 4,
  LEGENDARY: 5,
};

export const getRarity = (code: number): keyof typeof Rarity => {
  const rarity = Object.keys(Rarity).find((key) => Rarity[key as keyof typeof Rarity] === code);
  return rarity as keyof typeof Rarity;
};

export const getRarityCode = (record: string): number => {
  const rarityString = record
    .toUpperCase()
    .replace(" ", "_") as keyof typeof Rarity;
  return Rarity[rarityString] !== undefined
    ? Rarity[rarityString]
    : Rarity.NO_RARITY;
};