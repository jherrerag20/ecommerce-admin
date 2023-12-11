"use client"

import { ColumnDef } from "@tanstack/react-table"

export type ResOrderColumn = {
  image : string;
  productName : string;
  amount: number;
  price: string;
}

export const columns: ColumnDef<ResOrderColumn>[] = [

  {
    accessorKey: "image",
    header: "Imagen",
    cell: ({row}) => (
      <img
        src={row.original.image}
        alt="Product"
        className="w-10 h-10 object-cover"
      />
    ),
  },
  {
    accessorKey: "productName",
    header: "Nombre del producto",
  },
  {
    accessorKey: "amount",
    header: "Cantidad",
  },
  {
    accessorKey: "price",
    header: "Precio",
  },
  
]