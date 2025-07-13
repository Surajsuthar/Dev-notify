"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Column = {
  name: string;
  value: string;
};

export const columns: ColumnDef<Column>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
];
