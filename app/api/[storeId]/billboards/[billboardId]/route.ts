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

export async function GET(
    _req : Request,
    { params } : { params: { billboardId : string } }
) {

    try {

        if( !params.billboardId ) {
            return new NextResponse( "Billboard id is required", { status : 400 } );
        }

        const billboard = await prismadb.billboard.findUnique({
            where : {
                id : params.billboardId,
            },
        });

        return NextResponse.json( billboard, { headers: corsHeaders } ); 
        
    } catch (error) {
        console.log('[BILLBOARD_GET]', error);
        return new NextResponse("Internal Error", { status : 500 });
    }
    
};

export async function PATCH(
    req : Request,
    { params } : { params: { storeId : string ,billboardId : string } }
) {

    try {

        const { userId }= auth();

        const body = await req.json();

        const { label, imageUrl } = body;

        if( !userId ) {
            return new NextResponse( "Unauthenticated", { status : 401 } );
        }

        if( !label ) {
            return new NextResponse( "Label is required", { status : 400 } );
        }

        if( !imageUrl ) {
            return new NextResponse( "Image Url is required", { status : 400 } );
        }

        if( !params.billboardId ) {
            return new NextResponse( "Billboard id is required", { status : 400 } );
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

        const billboard = await prismadb.billboard.updateMany({
            where : {
                id : params.billboardId,
            },
            data : {
                label,
                imageUrl
            }
        });

        return NextResponse.json( billboard, { headers: corsHeaders } ); 
        
    } catch (error) {
        console.log('[BILLBOARD_PATCH]', error);
        return new NextResponse("Internal Error", { status : 500 });
    }
    
};

export async function DELETE(
    _req : Request,
    { params } : { params: { storeId : string, billboardId : string } }
) {

    try {

        const { userId }= auth();


        if( !userId ) {
            return new NextResponse( "Unauthenticated", { status : 401 } );
        }

        if( !params.billboardId ) {
            return new NextResponse( "Billboard id is required", { status : 400 } );
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

        const billboard = await prismadb.billboard.deleteMany({
            where : {
                id : params.billboardId,
            },
        });

        return NextResponse.json( billboard, { headers: corsHeaders } ); 
        
    } catch (error) {
        console.log('[BILLBOARD_DELETE]', error);
        return new NextResponse("Internal Error", { status : 500 });
    }
    
};