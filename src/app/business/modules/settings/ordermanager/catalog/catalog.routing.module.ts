import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogComponent } from './catalog.component';
import { CatalogdetailComponent } from './details/catalog-details.component';
import { AddItemsComponent } from './additems/additems.component';

const routes: Routes = [
    { path: '', component: CatalogComponent },
    { path: ':id', component: CatalogdetailComponent },
    { path: ':id/items', component: AddItemsComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CatalogRoutingModule {}
