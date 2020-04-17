import { NgModule } from '@angular/core';
import { GeneralSettingsComponent } from './general-settings.component';
import { ProviderWaitlistLocationDetailComponent } from '../../../../ynw_provider/components/provider-waitlist-location-detail/provider-waitlist-location-detail.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/modules/common/material.module';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';
import { MatSlideToggleModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProviderWaitlistLocationsModule } from '../../../../ynw_provider/components/provider-waitlist-locations/provider-waitlist-locations.module';
import { DepartmentModule } from '../../../../ynw_provider/shared/modules/department/department.module';
import { GeneralSettingsRoutingModule } from './general-settings.routing.module';
import { LoadingSpinnerModule } from '../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
import { DepartmentsComponent } from './departments/departments.component';
import { DepartmentDetailComponent } from './departments/details/department.details.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        CapitalizeFirstPipeModule,
        FormMessageDisplayModule,
        MatSlideToggleModule,
        FormsModule,
        ReactiveFormsModule,
        ProviderWaitlistLocationsModule,
        DepartmentModule,
        LoadingSpinnerModule,
        BreadCrumbModule,
        GeneralSettingsRoutingModule
    ],
    declarations: [
        GeneralSettingsComponent,
        ProviderWaitlistLocationDetailComponent,
        DepartmentsComponent,
        DepartmentDetailComponent
    ],
    exports: [
        GeneralSettingsComponent
    ]
})
export class GeneralSettingsModule {}
