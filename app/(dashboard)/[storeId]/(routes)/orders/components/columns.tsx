"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"
import { Badge, BadgeProps } from "@/components/ui/badge";

export type OrderColumn = {
  id: string;
  phone: string;
  address: string;
  clientName: string;
  delivery: string;
  isPaid: string;
  status: string
  totalPrice: string;
  products: string;
  createdAt: string;
}

const variantValue = (value: string): BadgeProps["variant"] => {
  if (value === "Pagado" || value === "Entregado") {
    return "secondary";
  } else {
    return "destructive";
  }
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Productos",
  },
  {
    accessorKey: "clientName",
    header: "Nombre",
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
    cell: ({ row }) => <Badge variant={ variantValue( row.original.isPaid ) }>{row.original.isPaid}</Badge>, // Usa el valor dentro de Badge
  },
  {
    accessorKey: "status",
    header: "Status de pedido",
    cell: ({ row }) => <Badge variant={ variantValue( row.original.status ) }>{row.original.status}</Badge>, // Usa el valor dentro de Badge
  },
  {
    accessorKey: "delivery",
    header: "Tipo de entrega",
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
