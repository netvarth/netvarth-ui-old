import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdermanagerComponent } from './ordermanager.component';

const routes: Routes = [
    { path: '', component: OrdermanagerComponent },
    {
        path: 'items', loadChildren: () => import('./item/items.module').then(m => m.ItemsModule)
    },
    { path: 'catalogs', loadChildren: () => import('./catalog/catalog.module').then(m => m.CatalogModule) },
    { path: 'storedetails', loadChildren: () => import('./store-details/store-details.module').then(m => m.StoreDetailsModule) },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrdermanagerRoutingModule { }
