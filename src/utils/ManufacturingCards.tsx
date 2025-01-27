"use client";

import { buttonStates } from "@/app/Manufacutre";
import { Button } from "@/components/ui/button";
import { useSelectedCardsTable } from "@/store";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ManufacturingCards({
  state,
  settingActivePhaseButton,
}: {
  state: Record<
    buttonStates,
    {
      active: boolean;
      disabled: boolean;
      success: boolean;
    }
  >;
  settingActivePhaseButton: (button: buttonStates) => void;
  privateKey: `0x${string}`;
}) {
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<unknown>();
  const { clearAllListAndCards } = useSelectedCardsTable();

  useEffect(() => {
    if (receipt) {
      toast.success("Downloaded successfully");
      settingActivePhaseButton("Allocate Tokens");
    }
  }, [receipt]);

  async function handleClaimCards() {
    setLoading(true);
    try {
      const claimCardsData = localStorage.getItem("claimCards");
      if (!claimCardsData) {
        toast.error("No data found");
        return;
      }

      const blob = new Blob([claimCardsData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "claim-cards.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      clearAllListAndCards();

      setReceipt(true);
    } catch (error) {
      console.error("Error", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      disabled={state["Manufacture"].disabled || loading}
      variant={
        state["Manufacture"].success
          ? "success"
          : loading
          ? "loading"
          : "default"
      }
      onClick={handleClaimCards}
    >
      Download JSON File
    </Button>
  );
}
