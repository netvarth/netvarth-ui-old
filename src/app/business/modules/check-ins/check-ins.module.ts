import { NgModule } from '@angular/core';
import { CheckInsComponent } from './check-ins.component';
import { AdjustQueueDelayComponent } from './queue-delay/adjust-queue-delay.component';
import { AdjustqueueDelayComponent } from './adjustqueue-delay/adjustqueue-delay.component';
import { CheckinsRoutingModule } from './check-ins.routing.module';
import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { PagerModule } from '../../../shared/modules/pager/pager.module';
import { LoadingSpinnerModule } from '../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { InboxModule } from '../../../shared/modules/inbox/inbox.module';
import { CustomerModule } from '../customer/customer.module';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProviderCheckinComponent } from './check-in/provider-checkin.component';
import { CheckinAddMemberModule } from '../../../shared/modules/checkin-add-member/checkin-add-member.module';
import { OwlModule } from 'ngx-owl-carousel';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ApplyLabelModule } from './apply-label/apply-label.module';
import { ProviderWaitlistCheckInDetailComponent } from './provider-waitlist-checkin-detail/provider-waitlist-checkin-detail.component';
import { AddProviderWaitlistCheckInProviderNoteModule } from './add-provider-waitlist-checkin-provider-note/add-provider-waitlist-checkin-provider-note.module';
import { LocateCustomerModule } from './locate-customer/locate-customer.module';
import { ProviderWaitlistCheckInConsumerNoteModule } from './provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.module';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { CheckinDetailsSendModule } from './checkin-details-send/checkin-details-send.modules';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { CheckinActionsComponent } from './checkin-actions/checkin-actions.component';
// import { DateRangePickerJComponent } from '../../../shared/components/date-range/date-range-picker.component';
import { MedicalrecordModule } from '../medicalrecord/medicalrecord.module';
import { VoicecallDetailsModule } from './voicecall-details/voicecall-details.modules';
import { MatTabsModule } from '@angular/material/tabs';
import { GalleryModule } from '../../../shared/modules/gallery/gallery.module';
import { QuestionnaireModule } from '../../../shared/components/questionnaire/questionnaire.module';


@NgModule({
    imports: [
        CheckinsRoutingModule,
        BreadCrumbModule,
        CommonModule,
        MatTabsModule,
        SharedModule,
        CapitalizeFirstPipeModule,
        PagerModule,
        LoadingSpinnerModule,
        Nl2BrPipeModule,
        InboxModule,
        CustomerModule,
        FormMessageDisplayModule,
        CheckinAddMemberModule,
        NgbModule,
        OwlModule,
        NgxMatSelectSearchModule,
        ApplyLabelModule,
        AddProviderWaitlistCheckInProviderNoteModule,
        LocateCustomerModule,
        VoicecallDetailsModule,
        ProviderWaitlistCheckInConsumerNoteModule,
        CheckinDetailsSendModule,
        NgxQRCodeModule,
        CustomerModule,
        MedicalrecordModule,
        GalleryModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
        QuestionnaireModule
    ],
    declarations: [
        CheckInsComponent,
        ProviderCheckinComponent,
        AdjustQueueDelayComponent,
        AdjustqueueDelayComponent,
        ProviderWaitlistCheckInDetailComponent,
        CheckinActionsComponent
        // DateRangePickerJComponent

    ],
    entryComponents: [
        AdjustQueueDelayComponent,
        CheckinActionsComponent
    ],
    exports: [CheckInsComponent]
})
export class CheckinsModule { }
