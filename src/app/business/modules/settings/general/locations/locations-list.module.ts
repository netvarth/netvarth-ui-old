import { NgModule } from '@angular/core';
import { LocationsListComponent } from './locations-list.component';
import { LocationsListRoutingModule } from './locations-list.routing.module';
import { LocationDetailsComponent } from './location-details/location-details.component';
import { LoadingSpinnerModule } from '../../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { MaterialModule } from '../../../../../shared/modules/common/material.module';
import { BreadCrumbModule } from '../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { CommonModule } from '@angular/common';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../../../shared/modules/form-message-display/form-message-display.module';
import { AddProviderSchedulesModule } from '../../../../../ynw_provider/components/add-provider-schedule/add-provider-schedule.module';
import { OrderModule } from 'ngx-order-pipe';

@NgModule({
    imports: [
        LocationsListRoutingModule,
        LoadingSpinnerModule,
        MaterialModule,
        BreadCrumbModule,
        CommonModule,
        CapitalizeFirstPipeModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        AddProviderSchedulesModule,
        OrderModule
    ],
    declarations: [
        LocationsListComponent,
        LocationDetailsComponent
    ],
    exports: [
        LocationsListComponent
    ]
})

export class LocationListModule { }
