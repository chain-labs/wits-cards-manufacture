"use client";

import { Input } from "@/components/ui/input";
import { useSelectedCardsTable } from "@/store";
import { cn } from "@/utils";
import AllocatingTokens from "@/utils/AllocatingTokens";
import GeneratingProof from "@/utils/GeneratingProof";
import UploadingCards from "@/utils/UploadingCards";
import { useEffect, useState } from "react";

export type buttonStates = "Allocate Tokens" | "Generate Proof" | "Uploading";

const MAX_ADDRESS_LENGTH = 66;

const diabledButtonsState: Record<
  buttonStates,
  {
    active: boolean;
    disabled: boolean;
    success: boolean;
  }
> = {
  "Allocate Tokens": {
    active: false,
    disabled: true,
    success: false,
  },
  "Generate Proof": {
    active: false,
    disabled: true,
    success: false,
  },
  Uploading: {
    active: false,
    disabled: true,
    success: false,
  },
};

export default function Manufacutre({
  changeState,
}: {
  changeState: () => void;
}) {
  const [state, setState] = useState<
    Record<
      buttonStates,
      {
        active: boolean;
        disabled: boolean;
        success: boolean;
      }
    >
  >({
    "Allocate Tokens": {
      active: false,
      disabled: true,
      success: false,
    },
    "Generate Proof": {
      active: false,
      disabled: true,
      success: false,
    },
    Uploading: {
      active: false,
      disabled: true,
      success: false,
    },
  });
  const [value, setValue] = useState<string>("");
  const [privatekeyError, setPrivatekeyError] = useState<boolean>(false);
  const { updateDisable, disableUpdate } = useSelectedCardsTable();

  useEffect(() => {
    if (state["Allocate Tokens"].success) {
      updateDisable(true);
    } else {
      updateDisable(false);
    }
  }, [state["Allocate Tokens"].success]);

  function settingActivePhaseButton(string: buttonStates) {
    const newState: typeof state = { ...state };
    for (const key in newState) {
      if (key === string) {
        newState[key] = {
          active: true,
          disabled: false,
          success: false,
        };
      } else {
        newState[key as buttonStates] = {
          active: false,
          disabled: true,
          success:
            (key === "Allocate Tokens" &&
              (string === "Generate Proof" || string === "Uploading")) ||
            (key === "Generate Proof" && string === "Uploading"),
        };
      }
    }
    setState(newState);
  }

  function checkPrivateKeyInput(
    e: React.ChangeEvent<HTMLInputElement> &
      React.KeyboardEvent<HTMLInputElement>,
  ) {
    e.preventDefault();

    if (e.key === "Enter") {
      e.preventDefault();
      return;
    }

    const value = e.target.value;
    const cleanedValue = value.trim().replace(/[^a-zA-Z0-9]/g, "");
    if (
      cleanedValue.slice(0, 2) !== "0x" &&
      cleanedValue.length !== MAX_ADDRESS_LENGTH
    ) {
      setPrivatekeyError(true);
      setState(diabledButtonsState);
    } else if (cleanedValue.length > MAX_ADDRESS_LENGTH) {
      setPrivatekeyError(true);
      setState(diabledButtonsState);
    } else {
      setPrivatekeyError(false);
      setState(diabledButtonsState);
    }

    if (cleanedValue.length === MAX_ADDRESS_LENGTH) {
      settingActivePhaseButton("Allocate Tokens");
    }

    setValue(cleanedValue);
  }

  return (
    <div
      className={cn(
        "w-full bg-cover",
        "flex flex-col items-center justify-center gap-[50px]",
        "px-[16px]",
      )}
    >
      <div className={cn("grid grid-flow-col place-items-center gap-4")}>
        <Input
          placeholder="Enter Private Key : 0x"
          className={cn(
            "bg-white max-w-[400px] w-[66ch]",
            privatekeyError && "border-red-500 text-red-500",
          )}
          value={value}
          onChange={checkPrivateKeyInput}
          disabled={disableUpdate}
        />
      </div>
      <div className="flex justify-center items-center gap-2">
        <AllocatingTokens
          state={state}
          settingActivePhaseButton={settingActivePhaseButton}
          privateKey={value as `0x${string}`}
        />
        <GeneratingProof
          state={state}
          privateKey={value as `0x${string}`}
          settingActivePhaseButton={settingActivePhaseButton}
        />
        <UploadingCards state={state} changeState={changeState} />
      </div>
    </div>
  );
}
