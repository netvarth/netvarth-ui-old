import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProviderSettingsRoutingModule } from './provider-settings-routing.module';
import { ProviderSettingsComponent } from './provider-settings.component';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../shared/modules/loading-spinner/loading-spinner.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { PagerModule } from '../../../shared/modules/pager/pager.module';
import { AddProviderSchedulesModule } from '../../../business/modules/add-provider-schedule/add-provider-schedule.module';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { JoyrideModule } from 'ngx-joyride';
import { UpdateEmailModule } from '../../../business/modules/update-email/update-email.module';
import { ProviderStartTourModule } from '../provider-start-tour/provider-start-tour.module';
import { DepartmentModule } from '../department/department.module';
import { QuestionService } from '../../../shared/modules/dynamic-form/dynamic-form-question.service';
import { MatTooltipModule } from '@angular/material/tooltip';
@NgModule({
    imports: [
        CapitalizeFirstPipeModule,
        ProviderSettingsRoutingModule,
        RouterModule,
        CommonModule,
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
        UpdateEmailModule,
        ProviderStartTourModule,
        MatTooltipModule,
        JoyrideModule.forChild()
    ],
    declarations: [
        ProviderSettingsComponent
    ],
    providers: [
        QuestionService
    ]
})

export class ProviderSettingsModule { }

