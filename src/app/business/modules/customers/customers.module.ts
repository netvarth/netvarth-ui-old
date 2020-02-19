import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { MaterialModule } from '../../../shared/modules/common/material.module';
import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { PagerModule } from '../../../shared/modules/pager/pager.module';
import { LoadingSpinnerModule } from '../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { CustomersRoutingModule } from './customers.routing.module';
import { CustomersListComponent } from './list/customers-list.component';
import { JaldeeFilterModule } from '../../../shared/modules/filter/filter.module';
import { DateFormatPipeModule } from '../../../shared/pipes/date-format/date-format.module';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { CustomerModule } from '../customer/customer.module';
import { CustomerDetailComponent } from './detail/customer-detail.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        MaterialModule,
        BreadCrumbModule,
        CapitalizeFirstPipeModule,
        PagerModule,
        LoadingSpinnerModule,
        CustomersRoutingModule,
        JaldeeFilterModule,
        DateFormatPipeModule,
        FormMessageDisplayModule,
        CustomerModule
    ],
    declarations: [CustomersListComponent, CustomerDetailComponent],
    entryComponents: [],
    exports: [CustomersListComponent]
})

export class CustomersModule { }
