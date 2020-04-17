import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/modules/common/material.module';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';
import { MatSlideToggleModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
import { PaymentSettingsComponent } from './payment-settings.component';
import { PaymentSettingsRoutingModule } from './payment-settings.routing.module';
import { ProviderPaymentSettingsComponent } from '../../../../ynw_provider/components/provider-payment-settings/provider-payment-settings.component';
import { ProvidertaxSettingsComponent } from '../../../../ynw_provider/components/provider-tax-settings/provider-tax-settings.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        CapitalizeFirstPipeModule,
        FormMessageDisplayModule,
        MatSlideToggleModule,
        FormsModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        BreadCrumbModule,
        PaymentSettingsRoutingModule
    ],
    declarations: [
        PaymentSettingsComponent,
        ProviderPaymentSettingsComponent,
        ProvidertaxSettingsComponent
    ],
    exports: [
        PaymentSettingsComponent
    ]
})
export class PaymentSettingsModule {}
