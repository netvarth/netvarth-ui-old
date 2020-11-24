import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdermanagerComponent } from './ordermanager.component';

const routes: Routes = [
    { path: '', component: OrdermanagerComponent },
    {
        path: 'items', loadChildren: () => import('./item/items.module').then(m => m.ItemsModule)
    },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrdermanagerRoutingModule { }
