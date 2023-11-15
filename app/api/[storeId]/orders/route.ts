import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
  ) {
    try {

      const { searchParams } = new URL(req.url);

      const phone = searchParams.get("phone")

      if (!phone) {
        return new NextResponse("Phone is required", { status: 400 });
      }

      if (!params.storeId) {
        return new NextResponse("Store id is required", { status: 400 });
      }
      
    
      const orders = await prismadb.order.findMany({
        where: {
          phone: phone,
          storeId: params.storeId
        }
      });
        
      return NextResponse.json(orders, { headers: corsHeaders });
    } catch (error) {

      console.log('[ORDERS_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };