import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProviderPaymentSettingsComponent } from '../../provider-payment-settings/provider-payment-settings.component';
import { ProvidertaxSettingsComponent } from '../../provider-tax-settings/provider-tax-settings.component';
import { PaymentSettingsComponent } from './payment-settings.component';

const routes: Routes = [
    {path: '', component: PaymentSettingsComponent},
    {path: 'taxsettings', component: ProvidertaxSettingsComponent },
    {path: 'paymentsettings', component: ProviderPaymentSettingsComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PaymentSettingsRoutingModule {}
