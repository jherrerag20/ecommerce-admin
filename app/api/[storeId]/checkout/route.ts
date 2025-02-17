import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { productIds, clientName, productsAmount ,phone, address, totalPrice, delivery } = await req.json();

    if (!phone) {
      return new NextResponse("Phone is required", { status: 403 });
    }

    if (!clientName) {
      return new NextResponse("Client Name is required", { status: 403 });
    }

    if (!delivery) {
      return new NextResponse("Delivery is required", { status: 403 });
    }

    if (!address) {
      return new NextResponse("Address is required", { status: 403 });
    }

    if (!totalPrice) {
      return new NextResponse("Total price is required", { status: 403 });
    }

    if (!productIds || productIds.length === 0) {
      return new NextResponse("Product ids are required", { status: 400 });
    }

    if (!productsAmount || productsAmount.length === 0) {
      return new NextResponse("Product amount are required", { status: 400 });
    }

    for (let i = 0; i < productIds.length; i++) {
      const productId = productIds[i];
      const amountToUpdate = productsAmount[i];

      await prismadb.product.update({
        where: {
          id: productId,
        },
        data: {
          amount: {
            decrement: amountToUpdate,
          },
        },
      });
    }

    const order = await prismadb.order.create({
      data: {
        phone,
        clientName,
        address,
        totalPrice,
        delivery,
        storeId: params.storeId,
        isPaid: false,
        orderItems: {
          create: productIds.map((productId: string, index: number) => ({
            product: {
              connect: {
                id: productId,
              },
            },
            productsAmount: productsAmount[index],
          })),
        },
      },
    });

    return NextResponse.json(order, {
      headers: corsHeaders,
      status: 200
    });

  } catch (error) {
    console.log('[CHECKOUT_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

