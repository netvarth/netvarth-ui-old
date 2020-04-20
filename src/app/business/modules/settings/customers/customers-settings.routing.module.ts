import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomersSettingsComponent } from './customers-settings.component';
import { CustomerIdSettingsComponent } from './custid/customer-id.component';

const routes: Routes = [
    {path: '', component: CustomersSettingsComponent},
    {path: 'custid', component: CustomerIdSettingsComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomersSettingsRoutingModule {}
