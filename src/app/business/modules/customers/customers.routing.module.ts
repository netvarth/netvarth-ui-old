import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomersListComponent } from './list/customers-list.component';
import { CustomerDetailComponent } from './detail/customer-detail.component';
import { CustomerSearchComponent } from './search/customer-search.component';
import { MedicalrecordListComponent } from '../medicalrecord/medicalrecord-list/medicalrecord-list.component';

const routes: Routes = [
   { path: ':id/:type/:uid/medicalrecord/:mrId', loadChildren: () => import('../../../business/modules/medicalrecord/medicalrecord.module').then(m => m.MedicalrecordModule) },
    {path : 'find' , component: CustomerSearchComponent },
    { path: '', component: CustomersListComponent },
    { path: ':id', component: CustomerDetailComponent},
    { path: 'mrlist', component: MedicalrecordListComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CustomersRoutingModule {}
