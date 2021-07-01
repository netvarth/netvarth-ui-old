import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppointmentsComponent } from './appointments.component';
import { AppointmentsRoutingModule } from './appointments.routing.module';
import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';
import { MaterialModule } from '../../../shared/modules/common/material.module';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { PagerModule } from '../../../shared/modules/pager/pager.module';
import { OwlModule } from 'ngx-owl-carousel';
import { LoadingSpinnerModule } from '../../../shared/modules/loading-spinner/loading-spinner.module';
import { ApplyLabelModule } from '../check-ins/apply-label/apply-label.module';
import { ProviderAppointmentDetailComponent } from './provider-appointment-detail/provider-appointment-detail.component';
import { InboxModule } from '../../../shared/modules/inbox/inbox.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { AddProviderWaitlistCheckInProviderNoteModule } from '../check-ins/add-provider-waitlist-checkin-provider-note/add-provider-waitlist-checkin-provider-note.module';
import { LocateCustomerModule } from '../check-ins/locate-customer/locate-customer.module';
import { ProviderWaitlistCheckInConsumerNoteModule } from '../check-ins/provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.module';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { AdjustscheduleDelayComponent } from './schedule-delay/adjust-schedule-delay.component';
import { CheckinDetailsSendModule } from '../check-ins/checkin-details-send/checkin-details-send.modules';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { AppointmentActionsComponent } from './appointment-actions/appointment-actions.component';
import { MedicalrecordModule } from '../medicalrecord/medicalrecord.module';
import { GalleryModule } from '../../../shared/modules/gallery/gallery.module';
import { QuestionnaireModule } from '../../../shared/components/questionnaire/questionnaire.module';
import { CardModule } from '../../../shared/components/card/card.module';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserServiceChangeModule } from '../../../shared/modules/user-service-change/user-service-change.module';
import { AppointmentComponent } from './appointment/appointment.component';
import { CheckinAddMemberModule } from '../../../shared/modules/checkin-add-member/checkin-add-member.module';


@NgModule({
    imports: [
        AppointmentsRoutingModule,
        BreadCrumbModule,
        MaterialModule,
        CapitalizeFirstPipeModule,
        SharedModule,
        PagerModule,
        OwlModule,
        LoadingSpinnerModule,
        ApplyLabelModule,
        LocateCustomerModule,
        InboxModule,
        Nl2BrPipeModule,
        AddProviderWaitlistCheckInProviderNoteModule,
        ProviderWaitlistCheckInConsumerNoteModule,
        CheckinDetailsSendModule,
        NgxQRCodeModule,
        MedicalrecordModule,
        GalleryModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
        QuestionnaireModule,
        CardModule,
        MatTableModule,
        MatCheckboxModule,
        UserServiceChangeModule,
        CheckinAddMemberModule
    ],
    declarations: [
        AppointmentsComponent,
        ProviderAppointmentDetailComponent,
        AdjustscheduleDelayComponent,
        AppointmentActionsComponent,
        AppointmentComponent
    ],
    entryComponents: [
        AppointmentActionsComponent
    ],
    exports: [AppointmentsComponent],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ],
})
export class AppointmentsModule { }
