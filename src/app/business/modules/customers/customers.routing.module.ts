import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomersListComponent } from './list/customers-list.component';
import { CustomerDetailComponent } from './detail/customer-detail.component';

const routes: Routes = [
    { path: '', component: CustomersListComponent },
    { path: ':id', component: CustomerDetailComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CustomersRoutingModule {}
