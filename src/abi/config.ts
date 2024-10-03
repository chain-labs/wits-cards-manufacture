import { skaleNebulaTestnet } from "viem/chains";

type Address = `0x${string}`;

export const CONTRACTS: Record<number, Address> = {
  [skaleNebulaTestnet.id]: "0x1234567890abcdef",
};
