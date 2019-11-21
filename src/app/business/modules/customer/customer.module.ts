import { NgModule } from '@angular/core';
import { SearchProviderCustomerComponent } from '../../../ynw_provider/components/search-provider-customer/search-provider-customer.component';
import { AddProviderCustomerComponent } from '../check-ins/add-provider-customer/add-provider-customer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { MaterialModule } from '../../../shared/modules/common/material.module';
import { LoadingSpinnerModule } from '../../../ynw_provider/components/loading-spinner/loading-spinner.module';

@NgModule({
    declarations: [
        SearchProviderCustomerComponent,
        AddProviderCustomerComponent
    ],
    entryComponents: [
        SearchProviderCustomerComponent,
        AddProviderCustomerComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CapitalizeFirstPipeModule,
        FormMessageDisplayModule,
        MaterialModule,
        LoadingSpinnerModule
    ],
    exports: []
})
export class CustomerModule { }
