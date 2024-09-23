"use client";

import { CardWithQuantity } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<CardWithQuantity>[] = [
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Rarity",
    accessorKey: "rarity",
  },
  {
    header: "Token ID",
    accessorKey: "tokenId",
  },
  {
    header: "Quantity",
    accessorKey: "quantity",
  },
];
