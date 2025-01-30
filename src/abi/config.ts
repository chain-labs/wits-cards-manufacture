import { abstractTestnet } from "viem/chains";

type Address = `0x${string}`;

export const CONTRACTS: Record<number, Address> = {
  [abstractTestnet.id]: "0x22dcDEdd718f470Ff118bF255B59C0EC312a085D",
};
