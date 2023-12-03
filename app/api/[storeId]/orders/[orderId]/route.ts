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
    _req : Request,
    { params } : { params: { storeId : string, orderId : string } }
) {

    try {

        const { userId }= auth();


        if( !userId ) {
            return new NextResponse( "Unauthenticated", { status : 401 } );
        }

        if( !params.orderId ) {
            return new NextResponse( "Order id is required", { status : 400 } );
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
              id: params.storeId,
              userId,
            }
          });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 405 });
        }

        const order = await prismadb.order.deleteMany({
            where : {
                id : params.orderId,
            },
        });

        return NextResponse.json( order, { headers: corsHeaders } ); 
        
    } catch (error) {
        console.log('[ORDER_DELETE]', error);
        return new NextResponse("Internal Error", { status : 500 });
    }
    
};