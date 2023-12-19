import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; orderId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.orderId) {
      return new NextResponse("Order id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    // Retrieve order details including order items
    const order = await prismadb.order.findUnique({
      where: {
        id: params.orderId,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Update product amounts for each order item
    for (const orderItem of order.orderItems) {
      await prismadb.product.update({
        where: {
          id: orderItem.product.id,
        },
        data: {
          amount: orderItem.product.amount + orderItem.productsAmount,
        },
      });
    }

    // Delete the order
    await prismadb.order.delete({
      where: {
        id: params.orderId,
      },
    });

    return NextResponse.json({ message: "Order deleted successfully" }, { headers: corsHeaders });
  } catch (error) {
    console.error('[ORDER_DELETE]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
