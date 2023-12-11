import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

const OrdersPage = async ({
    params
} : {
    params : { storeId: string }
}) => {
    const orders = await prismadb.order.findMany({
        where: {
            storeId : params.storeId
        },
        include: {
            orderItems : {
                include: {
                    product : true,
                }
            }
        },
        orderBy: {
            createdAt : 'desc'
        }
    });

    // Función isPaidFunction para obtener el estado de pago
    const isPaidFunction = (isPaid: boolean): string => {
        return isPaid ? "Pagado" : "Sin pagar";
    };
    
    // Función statusFunction para obtener el estado de entrega
    const statusFunction = (status: boolean): string => {
        return status ? "Entregado" : "En proceso";
    };

    const formatedOrders: OrderColumn[] = orders.map((item) => ({
        id: item.id,
        phone: item.phone,
        address: item.address,
        products: item.orderItems.map((orderItem) => {
            // Verificar si productsAmount es menor a amount_wholesalePrice
            const showWholesalePrice = orderItem.productsAmount >= orderItem.product.amount_wholesalePrice;
    
            // Mostrar el precio adecuado según la condición
            const priceToShow = showWholesalePrice ? orderItem.product.wholesalePrice : orderItem.product.price;
    
            return `${orderItem.product.name} (${orderItem.productsAmount}) ($${priceToShow})`;
        }).join(', '),
        totalPrice: formatter.format(item.totalPrice.toNumber()),
        clientName: item.clientName,
        delivery: item.delivery,
        isPaid: isPaidFunction(item.isPaid),
        status: statusFunction(item.status),
        createdAt: format(item.createdAt, "MMM do, yyyy"),
    }));
    

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6"> 
                <OrderClient data = {formatedOrders} />
            </div>
        </div>
    )
}


export default OrdersPage;
