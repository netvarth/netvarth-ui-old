import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemsComponent } from './items.component';
import { ItemDetailsComponent } from './details/item-details.component';

const routes: Routes = [
    { path: '', component: ItemsComponent },
    { path: ':id', component: ItemDetailsComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ItemsRoutingModule {}
