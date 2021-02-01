import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomersListComponent } from './list/customers-list.component';
import { CustomerSearchComponent } from './search/customer-search.component';
import { MedicalrecordListComponent } from '../medicalrecord/medicalrecord-list/medicalrecord-list.component';
import { CustomerCreateComponent } from './customer-create/customer-create.component';
import { CustomerDetailComponent } from './customer-details/customer-details.component';

const routes: Routes = [
   { path: ':id/:type/:uid/medicalrecord/:mrId', loadChildren: () => import('../../../business/modules/medicalrecord/medicalrecord.module').then(m => m.MedicalrecordModule) },
    {path : 'find' , component: CustomerSearchComponent },
    { path: '', component: CustomersListComponent },
    { path: 'mrlist', component: MedicalrecordListComponent },
    { path: 'create', component: CustomerCreateComponent },
    { path: ':id', component: CustomerDetailComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CustomersRoutingModule {}
