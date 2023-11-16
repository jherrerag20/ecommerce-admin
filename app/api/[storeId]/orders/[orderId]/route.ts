import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params, query }: { params: { orderId: string }; query: { field: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.orderId) {
      return new NextResponse("Order id is required", { status: 400 });
    }

    const validFields = ["isPaid", "status"];
    const fieldToUpdate = query.field;

    if (!validFields.includes(fieldToUpdate)) {
      return new NextResponse(
        `Invalid field. Supported fields are: ${validFields.join(", ")}`,
        { status: 400 }
      );
    }

    // Obtener la orden actual desde la base de datos
    const currentOrder = await prismadb.order.findUnique({
      where: {
        id: params.orderId,
      },
    });

    if (!currentOrder) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Cambiar el valor del campo especificado al opuesto
    const updatedFieldValue =
      fieldToUpdate === "isPaid" ? !currentOrder.isPaid : !currentOrder.status;

    // Actualizar la orden en la base de datos
    const updatedOrder = await prismadb.order.update({
      where: {
        id: params.orderId,
      },
      data: {
        [fieldToUpdate]: updatedFieldValue,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.log("[ORDER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


