"use client";

import { buttonStates } from "@/app/Manufacutre";
import { SelectedCardsTable } from "@/store";

export default function useAllocatingTokens(
  settingActivePhaseButton: (string: buttonStates) => void,
  list: SelectedCardsTable["list"],
) {
  console.log("list", list);
  settingActivePhaseButton("Generate Proof");
}
