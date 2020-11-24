import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdermanagerComponent } from './ordermanager.component';
import { CatalogComponent } from './catalog/catalog.component';
import { StoreDetailsComponent } from './store-details/store-details.component';

const routes: Routes = [
    { path: '', component: OrdermanagerComponent },
    {
        path: 'items', loadChildren: () => import('./item/items.module').then(m => m.ItemsModule)
    },
    { path: 'catalogs', component: CatalogComponent },
    { path: 'storedetails', component: StoreDetailsComponent }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrdermanagerRoutingModule { }
