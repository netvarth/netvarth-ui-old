import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderDashboardComponent } from './order-dashboard.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderEditComponent } from './order-edit/order-edit.component';

const routes: Routes = [
    { path: '', component: OrderDashboardComponent },
    { path: 'edit', component: OrderEditComponent },
    { path: ':id', component: OrderDetailsComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrderDashboardRoutingModule { }