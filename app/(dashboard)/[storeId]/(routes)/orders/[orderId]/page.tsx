import prismadb from "@/lib/prismadb";
import { ResOrderClient } from "./components/client";
import { formatter } from "@/lib/utils";

const ProductPage = async ({
    params
} : { 
    params : { orderId : string, storeId : string }
}) => {

    // Obtener la orden con los productos y sus imágenes
    const order = await prismadb.order.findUnique({
        where : {
            id: params.orderId
        },
        include: {
            orderItems: {
                include: {
                    product: {
                        include: {
                            images: {
                                take: 1 // Tomar solo la primera imagen
                            }
                        }
                    }
                }
            }
        }
    });

    // Verificar si la orden y los elementos de la orden existen
    if (!order || !order.orderItems) {
        // Manejar el caso en el que la orden no existe o no tiene elementos
        return <div>No se encontró la orden o no tiene productos.</div>;
    }

    const resOrderColumns = order.orderItems.map((orderItem) => {
        const price = orderItem.productsAmount >= orderItem.product.amount_wholesalePrice
            ? formatter.format(orderItem.product.wholesalePrice.toNumber())
            : formatter.format(orderItem.product.price.toNumber());

        return {
            image: orderItem.product.images.length > 0 ? orderItem.product.images[0].url : '',
            productName: orderItem.product.name,
            amount: orderItem.productsAmount,
            price: price,
        };
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6"> 
                <ResOrderClient data = {resOrderColumns} />
            </div>
        </div>
    );
}

export default ProductPage;

