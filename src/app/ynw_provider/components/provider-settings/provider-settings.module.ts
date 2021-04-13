import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProviderSettingsRoutingModule } from './provider-settings-routing.module';
import { ProviderSettingsComponent } from './provider-settings.component';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';
import { MaterialModule } from '../../../shared/modules/common/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../shared/modules/loading-spinner/loading-spinner.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { AddProviderWaitlistLocationsComponent } from '../add-provider-waitlist-locations/add-provider-waitlist-locations.component';
import { PagerModule } from '../../../shared/modules/pager/pager.module';
import { AddProviderSchedulesModule } from '../add-provider-schedule/add-provider-schedule.module';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentModule } from '../../shared/modules/department/department.module';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { JoyrideModule } from 'ngx-joyride';
@NgModule({
    imports: [
        CapitalizeFirstPipeModule,
        ProviderSettingsRoutingModule,
        BreadCrumbModule,
        RouterModule,
        CommonModule,
        MaterialModule,
        FormsModule,
        LoadingSpinnerModule,
        Nl2BrPipeModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
        ReactiveFormsModule,
        FormMessageDisplayModule,
        PagerModule,
        AddProviderSchedulesModule,
        NgbTimepickerModule,
        DepartmentModule,
        NgxQRCodeModule,
        JoyrideModule.forChild()
    ],
    declarations: [
        ProviderSettingsComponent,
        AddProviderWaitlistLocationsComponent
    ],
    entryComponents: [
        AddProviderWaitlistLocationsComponent
    ]
})

export class ProviderSettingsModule { }

