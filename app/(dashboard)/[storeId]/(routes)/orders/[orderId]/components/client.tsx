"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ResOrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface  ResOrderClientProps {
    data : ResOrderColumn[]
}

export const ResOrderClient : React.FC<ResOrderClientProps> = ({
    data
}) => {


      return (
        <>
          <Heading title={"Resumen de la orden"} description="Estos son los productos solicitados" /> 
          <Separator />
          <DataTable columns={columns} data={data} searchKey="productName" />
        </>
      );

}