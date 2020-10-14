import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomersListComponent } from './list/customers-list.component';
import { CustomerDetailComponent } from './detail/customer-detail.component';
import { CustomerSearchComponent } from './search/customer-search.component';

const routes: Routes = [
  // { path: 'medicalrecord', loadChildren: () => import('../../../business/modules/medicalrecord/medicalrecord.module').then(m => m.MedicalrecordModule) },
    {path : 'find' , component: CustomerSearchComponent },
    { path: '', component: CustomersListComponent },
    { path: ':id', component: CustomerDetailComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CustomersRoutingModule {}
