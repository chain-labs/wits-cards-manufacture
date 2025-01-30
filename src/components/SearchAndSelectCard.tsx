"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card } from "@/types";

interface SearchAndSelectProps{
  list: Card[];
  searchPlaceholder?: string;
  emptyListMessage?: string;
  value: Card | null;
  setValue: React.Dispatch<React.SetStateAction<Card | null>>;
  disabled?: boolean;
}

export function SearchAndSelectCard({
  list,
  searchPlaceholder = "Search...",
  emptyListMessage = "No item found.",
  value,
  setValue,
  disabled,
}: SearchAndSelectProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          disabled={disabled}
        >
          {value ? list.find((l) => l.tid === value.tid)?.tid : searchPlaceholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyListMessage}</CommandEmpty>
            <CommandGroup>
              {list.map((l, idx) => (
                <CommandItem
                  key={idx}
                  value={l.tid}
                  onSelect={(currentValue) => {
                    const selectedCard = list.find((card) => card.tid === currentValue) || null;
                    setValue(selectedCard === value ? null : selectedCard);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value?.tid === l.tid ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {l.tid}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
