import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentSettingsComponent } from './payment-settings.component';

const routes: Routes = [
    {path: '', component: PaymentSettingsComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PaymentSettingsRoutingModule {}
