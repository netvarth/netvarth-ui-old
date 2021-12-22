import { NgModule } from '@angular/core';
import { CheckInsComponent } from './check-ins.component';
import { CommonModule } from '@angular/common';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { PagerModule } from '../../../shared/modules/pager/pager.module';
import { LoadingSpinnerModule } from '../../../shared/modules/loading-spinner/loading-spinner.module';
import { AddProviderWaitlistCheckInProviderNoteModule } from './add-provider-waitlist-checkin-provider-note/add-provider-waitlist-checkin-provider-note.module';
import { LocateCustomerModule } from './locate-customer/locate-customer.module';
import { ProviderWaitlistCheckInConsumerNoteModule } from './provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.module';
import { CheckinDetailsSendModule } from './checkin-details-send/checkin-details-send.modules';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { VoicecallDetailsModule } from './voicecall-details/voicecall-details.modules';
import { MatTabsModule } from '@angular/material/tabs';
import { CardModule } from '../../../shared/components/card/card.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AttachmentPopupModule } from '../../../shared/components/attachment-popup/attachment-popup.module';
import { ConfirmBoxModule } from '../../shared/confirm-box/confirm-box.module';
import { InstantQueueModule } from './instant-q/instant-queue.module';
import { RouterModule, Routes } from '@angular/router';
import { CheckinsActionsModule } from './checkin-actions/checkin-actions.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { OwlModule } from 'ngx-owl-carousel';
import { FormsModule } from '@angular/forms';
import { ApplyLabelModule } from './apply-label/apply-label.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgbCarouselModule} from '@ng-bootstrap/ng-bootstrap';
import { BookingHistoryModule } from '../appointments/booking-history/booking-history.module';
// import {NgbCarousel} from '@ng-bootstrap/ng-bootstrap';



const routes: Routes = [
    { path: '', component: CheckInsComponent },
    { 
        path: '',
        children: [
            { path: 'add', loadChildren: ()=> import('./check-in/provider-checkin.module').then(m=>m.ProviderCheckinModule)},
            { path: 'adjustdelay', loadChildren:()=> import('./adjustqueue-delay/adjustqueue-delay.module').then(m=>m.AdjustqueueDelayModule)},
            { path: 'questionnaires', loadChildren: () => import('../questionnaire-list-popup/questionnaire-list-popup.module').then(m => m.QuestionnaireListPopupModule) },            
            { path: ':id', loadChildren: ()=> import('./provider-waitlist-checkin-detail/provider-waitlist-checkin-detail.module').then(m=>m.ProviderWaitlistCheckInDetailModule)},
            { path: ':id/add-label', loadChildren: ()=> import('./apply-label/apply-label.module').then(m=>m.ApplyLabelModule)},
            { path: ':id/user', loadChildren: () => import('../../../shared/modules/user-service-change/user-service-change.module').then(m => m.UserServiceChangeModule) },
            { path: ':id/team', loadChildren: () => import('../../../shared/modules/assign-team/assign-team.module').then(m => m.AssignTeamModule) },
            { path: ':id/updateloc', loadChildren: ()=> import('./location-update/location-update.module').then(m=>m.LocationUpdateModule)},
            { path: ':id/print', loadChildren: ()=> import('../../shared/print-booking-details/print-booking-detail.module').then(m=>m.PrintBookingDetailModule)}           
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        NgbCarouselModule,
        FormsModule,
        MatTabsModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatDatepickerModule,
        ProviderWaitlistCheckInConsumerNoteModule,
        CheckinDetailsSendModule,
        LocateCustomerModule,
        AddProviderWaitlistCheckInProviderNoteModule,
        InstantQueueModule,
        ConfirmBoxModule,
        AttachmentPopupModule,
        VoicecallDetailsModule,
        CheckinsActionsModule,
        ApplyLabelModule,
        LoadingSpinnerModule,
        CardModule,
        PagerModule,
        CapitalizeFirstPipeModule,
        OwlModule,
        BookingHistoryModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        CheckInsComponent,

    ],
    exports: [CheckInsComponent]
})
export class CheckinsModule { }
