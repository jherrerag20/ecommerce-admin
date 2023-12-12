"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ResOrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import DownloadPDFButton from "./createPDF";


interface  ResOrderClientProps {
    data : ResOrderColumn[]
    totalPrice: string;
    orderInfo: {
      clientName: string;
      clientPhone: string;
      address: string;
    };
}

export const ResOrderClient : React.FC<ResOrderClientProps> = ({
    data, totalPrice, orderInfo
}) => {
  return (
    <>
      <Heading title={"Resumen de la orden"} description="Estos son los productos solicitados" /> 
      <Separator />
      <DataTable columns={columns} data={data} searchKey="productName" />
      <DownloadPDFButton data={data} totalPrice={totalPrice} orderInfo={orderInfo}/>
    </>
  );
};
