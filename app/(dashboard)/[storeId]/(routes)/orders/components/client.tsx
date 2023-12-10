"use client";

import { useState } from "react";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";

interface  OrderClientProps {
    data : OrderColumn[]
}

export const OrderClient : React.FC<OrderClientProps> = ({
    data
}) => {

    const [filteredData, setFilteredData] = useState<OrderColumn[]>(data);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
    const applyFilter = (filter: string | null) => {
        if (filter === null) {
          setFilteredData(data);
        } else {
          const filteredOrders = data.filter((order) => {

            if (filter === "Pagado") {

              return order.isPaid === "Pagado";

            } else if (filter === "Sin pagar") {

              return order.isPaid === "Sin pagar";

            } else if (filter === "Entregado") {

              return order.status === "Entregado";

            } else if (filter === "En proceso") {

              return order.status === "En proceso";

            }
            return false;

          });
          setFilteredData(filteredOrders);
        }
        setActiveFilter(filter);
      };

      return (
        <>
          <Heading title={`Ordenes (${data.length})`} description="Estas son tus ordenes" /> 
          <Separator />
          <div className="flex space-x-2 mt-4">
            <Button
              variant={activeFilter === "Pagado" ? "secondary" : "outline"}
              onClick={() => applyFilter("Pagado")}
            >
              Pagado
            </Button>
            <Button
              variant={activeFilter === "Sin pagar" ? "secondary" : "outline"}
              onClick={() => applyFilter("Sin pagar")}
            >
              Sin pagar
            </Button>
            <Button
              variant={activeFilter === "Entregado" ? "secondary" : "outline"}
              onClick={() => applyFilter("Entregado")}
            >
              Entregado
            </Button>
            <Button
              variant={activeFilter === "En proceso" ? "secondary" : "outline"}
              onClick={() => applyFilter("En proceso")}
            >
              En proceso
            </Button>
            <Button
              variant={activeFilter === null ? "secondary" : "outline"}
              onClick={() => applyFilter(null)}
            >
              Todos
            </Button>
          </div>
          <DataTable columns={columns} data={filteredData} searchKey="products" />
        </>
      );

}