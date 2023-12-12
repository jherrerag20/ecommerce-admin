import prismadb from "@/lib/prismadb";
import { ResOrderClient } from "./components/client";
import { formatter } from "@/lib/utils";

const ResOrderPage = async ({
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

        const totalPrice = orderItem.productsAmount >= orderItem.product.amount_wholesalePrice
        ? formatter.format(orderItem.product.wholesalePrice.toNumber() * orderItem.productsAmount)
        : formatter.format(orderItem.product.price.toNumber() * orderItem.productsAmount);
        
        const totalPriceNumber = orderItem.productsAmount >= orderItem.product.amount_wholesalePrice
        ? orderItem.product.wholesalePrice.toNumber() * orderItem.productsAmount
        : orderItem.product.price.toNumber() * orderItem.productsAmount;

        return {
            image: orderItem.product.images.length > 0 ? orderItem.product.images[0].url : '',
            productName: orderItem.product.name,
            amount: orderItem.productsAmount,
            price: price,
            totalPrice: totalPrice,
            totalPriceNumber: totalPriceNumber
        };
    });

    const totalOfTotals = resOrderColumns.reduce((acc, orderColumn) => {
        return acc + orderColumn.totalPriceNumber;
    }, 0);

    const orderInfo = {

        clientName: order.clientName,
        clientPhone: order.phone,
        address: order.address

    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6"> 
                <ResOrderClient data = {resOrderColumns} totalPrice={formatter.format(totalOfTotals)} orderInfo={orderInfo}/>
            </div>
        </div>
    );
}

export default ResOrderPage;

