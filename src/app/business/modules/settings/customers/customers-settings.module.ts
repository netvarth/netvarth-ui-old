import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersSettingsComponent } from './customers-settings.component';
import { RouterModule, Routes } from '@angular/router';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
const routes: Routes = [
    {path: '', component: CustomersSettingsComponent},
    {path: 'custid', loadChildren: ()=> import('./custid/customer-id.module').then(m=>m.CustomerIdSettingsModule)}
];
@NgModule({
    imports: [
        CommonModule,
        CapitalizeFirstPipeModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [ CustomersSettingsComponent ],
    exports: [ CustomersSettingsComponent ]
})
export class CustomersSettingsModule {}
