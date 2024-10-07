"use client";

import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";

export function makingAccount(privateKey: `0x${string}`) {
  // creating account from private key
  const account = privateKeyToAccount(privateKey);

  // creating client wallet
  const client = createWalletClient({
    account,
    chain: mainnet,
    transport: http(),
  });
}
