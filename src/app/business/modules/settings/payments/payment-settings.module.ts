import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { PaymentSettingsComponent } from './payment-settings.component';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
    {path: '', component: PaymentSettingsComponent},
    {path: 'taxsettings', loadChildren: ()=> import('../../provider-tax-settings/provider-tax-settings.module').then(m=>m.ProvidertaxSettingsModule)},
    {path: 'paymentsettings', loadChildren: ()=> import('../../provider-payment-settings/provider-payment-settings.module').then(m=>m.ProviderPaymentSettingsModule)},
];
@NgModule({
    imports: [
        CommonModule,
        MatSlideToggleModule,
        FormsModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        PaymentSettingsComponent
    ],
    exports: [
        PaymentSettingsComponent
    ]
})
export class PaymentSettingsModule {}
