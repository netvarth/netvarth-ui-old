import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppointmentsComponent } from './appointments.component';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { PagerModule } from '../../../shared/modules/pager/pager.module';
import { OwlModule } from 'ngx-owl-carousel';
import { LoadingSpinnerModule } from '../../../shared/modules/loading-spinner/loading-spinner.module';
import { ProviderWaitlistCheckInConsumerNoteModule } from '../check-ins/provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.module';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { GalleryModule } from '../../../shared/modules/gallery/gallery.module';
import { CardModule } from '../../../shared/components/card/card.module';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AttachmentPopupModule } from '../../../shared/components/attachment-popup/attachment-popup.module';
import { VoicecallDetailsSendModule } from './voicecall-details-send/voicecall-details-send.module';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentActionsModule } from './appointment-actions/appointment-actions.module';
import { ProviderWaitlistCheckInCancelModule } from '../check-ins/provider-waitlist-checkin-cancel-popup/provider-waitlist-checkin-cancel-popup.module';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { BookingHistoryModule } from '../../shared/booking-history/booking-history.module';
import { TeleBookingService } from '../../../shared/services/tele-bookings-service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
const routes: Routes = [
    { path: '', component: AppointmentsComponent },
    {
        path: '',
        children: [
            { path: 'adjustdelay', loadChildren: () => import('./schedule-delay/adjust-schedule-delay.module').then(m => m.AdjustScheduleDelayModule) },
            { path: 'appointment', loadChildren: ()=> import('./appointment/appointment.module').then(m=>m.AppointmentModule) },
            { path: 'questionnaires', loadChildren: () => import('../questionnaire-list-popup/questionnaire-list-popup.module').then(m => m.QuestionnaireListPopupModule) },
            { path: ':id', loadChildren: ()=> import('./provider-appointment-detail/provider-appointment-detail.module').then(m=>m.ProviderAppointmentDetailModule) },
            { path: ':id/user', loadChildren: () => import('../../../shared/modules/user-service-change/user-service-change.module').then(m => m.UserServiceChangeModule) },
            { path: ':id/team', loadChildren: () => import('../../../shared/modules/assign-team/assign-team.module').then(m => m.AssignTeamModule) },
            { path: ':id/print', loadChildren: ()=> import('../../shared/print-booking-details/print-booking-detail.module').then(m=>m.PrintBookingDetailModule)}           

        ]
    }
];
@NgModule({
    imports: [
        CommonModule,
        CapitalizeFirstPipeModule,
        PagerModule,
        OwlModule,
        FormsModule,
        LoadingSpinnerModule,
        ProviderWaitlistCheckInConsumerNoteModule,
        ProviderWaitlistCheckInCancelModule,
        GalleryModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
        CardModule,
        MatTableModule,
        MatCheckboxModule,
        MatTabsModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        MatFormFieldModule,
        MatChipsModule,
        MatDatepickerModule,
        AttachmentPopupModule,
        VoicecallDetailsSendModule,
        AppointmentActionsModule,
        FormsModule,
        BookingHistoryModule,
        MatAutocompleteModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        AppointmentsComponent
    ],
    exports: [AppointmentsComponent],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ],
      providers: [TeleBookingService]
})
export class AppointmentsModule { }
