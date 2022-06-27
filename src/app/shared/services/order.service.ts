import { Injectable } from "@angular/core";
import { ServiceMeta } from "./service-meta";

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    constructor(private servicemeta: ServiceMeta) { }


    /**
     * 
     * @param accountid 
     * @returns list of catalogs
     */
    getConsumerCatalogs(accountid) {
        const url = 'consumer/orders/catalogs/' + accountid;
        return this.servicemeta.httpGet(url);
    }

    getCatalogById(catalogs, catalogId) {
        console.log("CAtalogs:", catalogs);
        console.log("ID:", catalogId);
        let catalogArray = catalogs.filter(catalog => catalog.id == catalogId);
        console.log("CatalogArray", catalogArray);
        if (catalogArray.length > 0) {
            return catalogArray[0];
        }
        return null;
    }

    getCatalogItemById(catalog, catalogItemId) {
        let catalogItemArray = catalog.catalogItem.filter(catalogItem => catalogItem.id == catalogItemId);
        if (catalogItemArray.length > 0) {
            return catalogItemArray[0];
        }
        return null;
    }

    // /**
    //  * returns Catalog Item Object
    //  * @param catalogId 
    //  * @param itemId 
    //  * @param accountId 
    //  */
    // getCatalogItem(catalogId, itemId, accountId) {  
    //     const url = "consumer/orders/catalogs/" + catalogId + "/item/" + itemId + "?account=" + accountId;
    //     return this.servicemeta.httpGet(url);
    // }

    /**
     * 
     * @param orders 
     * @param item 
     * @returns 
     */
    getItemQty(orders, itemId) {
        const orderList = orders;
        console.log("Cart Items:", orderList);
        let qty = 0;
        if (orderList !== null && orderList.filter(i => i.id == itemId)) {
            qty = orderList.filter(i => i.id == itemId).length;
        }
        return qty;
    }
}