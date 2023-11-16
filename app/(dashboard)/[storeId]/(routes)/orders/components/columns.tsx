"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"
import { Badge } from "@/components/ui/badge";

export type OrderColumn = {
  id: string;
  phone: string;
  address: string;
  isPaid: string;
  status: string
  totalPrice: string;
  products: string;
  createdAt: string;
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Productos",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Dirección",
  },
  {
    accessorKey: "totalPrice",
    header: "Precio total",
  },
  {
    accessorKey: "isPaid",
    header: "Status pago",
    cell: ({ row }) => <Badge>{row.original.isPaid}</Badge>, // Usa el valor dentro de Badge
  },
  {
    accessorKey: "status",
    header: "Status de pedido",
    cell: ({ row }) => <Badge>{row.original.status}</Badge>, // Usa el valor dentro de Badge
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id : "actions",
    cell : ({ row }) => <CellAction data={row.original} />
  }
]
