import { NgModule } from '@angular/core';
import { CKEditorModule } from 'ng2-ckeditor';
import { SharedModule } from '../shared/modules/common/shared.module';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ModalGalleryModule } from 'angular-modal-gallery';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { ProviderRouterModule } from './provider-routing.module';
import { HeaderModule } from '../shared/modules/header/header.module';
import { PagerModule } from '../shared/modules/pager/pager.module';
import { CheckInModule } from '../shared/modules/check-in/check-in.module';
import { CapitalizeFirstPipeModule } from '../shared/pipes/capitalize.module';
import { ProviderComponent } from './provider.component';
import { ProviderHomeComponent } from './components/home/provider-home.component';
import { ProviderProfileComponent } from './components/provider-profile/provider-profile.component';
import { ProviderTourComponent } from './components/provider-tour/provider-tour.component';
import { ProviderMembersComponent } from './components/provider-members/provider-members.component';
import { ConfirmBoxComponent } from './shared/component/confirm-box/confirm-box.component';
import { ConfirmPaymentBoxComponent } from './shared/component/confirm-paymentbox/confirm-paymentbox.component';
import { NotificationListBoxComponent } from './shared/component/notification-list-box/notification-list-box.component';
import { AddProviderMemberComponent } from './components/add-provider-member/add-provider-member.component';
import { AdjustQueueDelayComponent } from './components/adjust-queue-delay/adjust-queue-delay.component';
import { ProviderbWizardComponent } from './components/provider-bwizard/provider-bwizard.component';
import { AuthGuardProviderHome, AuthGuardNewProviderHome } from '../shared/guard/auth.guard';
import { ProviderWaitlistCheckInCancelPopupComponent } from './components/provider-waitlist-checkin-cancel-popup/provider-waitlist-checkin-cancel-popup.component';
import { ProviderWaitlistCheckInConsumerNoteComponent } from './components/provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.component';
import { ProviderWaitlistCheckInDetailComponent } from './components/provider-waitlist-checkin-detail/provider-waitlist-checkin-detail.component';
import { AddProviderWaitlistCheckInProviderNoteComponent } from './components/add-provider-waitlist-checkin-provider-note/add-provider-waitlist-checkin-provider-note.component';
import { AddProviderWaitlistCheckInBillComponent } from './components/add-provider-waitlist-checkin-bill/add-provider-waitlist-checkin-bill.component';
import { ViewProviderWaitlistCheckInBillComponent } from './components/view-provider-waitlist-checkin-bill/view-provider-waitlist-checkin-bill.component';
import { ProviderWaitlistCheckInPaymentComponent } from './components/provider-waitlist-checkin-payment/provider-waitlist-checkin-payment.component';
import { ProviderSystemAuditLogComponent } from './components/provider-system-auditlogs/provider-system-auditlogs.component';
import { ProviderSystemAlertComponent } from './components/provider-system-alerts/provider-system-alerts.component';
import { ProviderCustomersComponent } from './components/provider-customers/provider-customers.component';
import { AddProviderCustomerComponent } from './components/add-provider-customer/add-provider-customer.component';
import { SearchProviderCustomerComponent } from './components/search-provider-customer/search-provider-customer.component';
import { ProviderRefundComponent } from './components/provider-refund/provider-refund.component';
import { SharedServices } from '../shared/services/shared-services';
import { SharedFunctions } from '../shared/functions/shared-functions';
import { ProviderServices } from './services/provider-services.service';
import { ProviderDataStorageService } from './services/provider-datastorage.service';
import { MessageService } from './services/provider-message.service';
import { ProviderSharedFuctions } from './shared/functions/provider-shared-functions';
import { ProviderResolver } from './services/provider-resolver.service';
import { QuestionService } from './components/dynamicforms/dynamic-form-question.service';
import { projectConstants } from '../shared/constants/project-constants';
import { BreadCrumbModule } from '../shared/modules/breadcrumb/breadcrumb.module';
import { InboxModule } from '../shared/modules/inbox/inbox.module';
import { ViewBillModule } from '../shared/modules/view-bill/view-bill.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import 'hammerjs';
import 'mousetrap';
import { ProviderSubeaderModule } from './components/provider-subheader/provider-subheader.module';
import { LoadingSpinnerModule } from './components/loading-spinner/loading-spinner.module';
import { ProviderWaitlistOnlineCheckinModule } from './components/provider-waitlist-online-checkin/provider-waitlist-online-checkin.module';
import { AddProviderSchedulesModule } from './components/add-provider-schedule/add-provider-schedule.module';
import { AddProviderWaitlistQueuesComponent } from './components/add-provider-waitlist-queues/add-provider-waitlist-queues.component';
import { AddProviderWaitlistServiceComponent } from './components/add-provider-waitlist-service/add-provider-waitlist-service.component';
import { GoogleMapComponent } from './components/googlemap/googlemap.component';
import { DynamicFormComponent } from './components/dynamicforms/dynamic-form.component';
import { DynamicFormQuestionComponent } from './components/dynamicforms/dynamic-form-question.component';
import { ProviderBprofileSearchDynamicComponent } from './components/provider-bprofile-search-dynamic/provider-bprofile-search-dynamic.component';
import { VirtualFieldsComponent } from './components/virtual-fields/virtual-fields.component';
@NgModule({
  imports: [
    CapitalizeFirstPipeModule,
    ProviderRouterModule,
    SharedModule,
    CKEditorModule,
    ModalGalleryModule.forRoot(),
    AngularMultiSelectModule,
    BreadCrumbModule,
    HeaderModule,
    PagerModule,
    InboxModule,
    CheckInModule,
    ViewBillModule,
    Nl2BrPipeModule,
    ProviderSubeaderModule,
    LoadingSpinnerModule,
    ProviderWaitlistOnlineCheckinModule,
    AddProviderSchedulesModule
  ],
  declarations: [
    ProviderComponent,
    ProviderHomeComponent,
    ProviderProfileComponent,
    ProviderTourComponent,
    ProviderMembersComponent,
    AddProviderMemberComponent,
    ConfirmBoxComponent,
    ConfirmPaymentBoxComponent,
    NotificationListBoxComponent,
    AdjustQueueDelayComponent,
    ProviderbWizardComponent,
    DynamicFormComponent,
    DynamicFormQuestionComponent,
    ProviderWaitlistCheckInCancelPopupComponent,
    ProviderWaitlistCheckInConsumerNoteComponent,
    ProviderWaitlistCheckInDetailComponent,
    AddProviderWaitlistCheckInProviderNoteComponent,
    AddProviderWaitlistCheckInBillComponent,
    ViewProviderWaitlistCheckInBillComponent,
    ProviderWaitlistCheckInPaymentComponent,
    ProviderSystemAuditLogComponent,
    ProviderSystemAlertComponent,
    ProviderCustomersComponent,
    AddProviderCustomerComponent,
    SearchProviderCustomerComponent,
    ProviderRefundComponent,
    AddProviderWaitlistQueuesComponent,
    AddProviderWaitlistServiceComponent,
    GoogleMapComponent,
    ProviderBprofileSearchDynamicComponent,
    VirtualFieldsComponent,
  ],
  exports: [ConfirmBoxComponent, ConfirmPaymentBoxComponent],
  entryComponents: [
    ConfirmBoxComponent,
    ConfirmPaymentBoxComponent,
    NotificationListBoxComponent,
    AddProviderMemberComponent,
    AdjustQueueDelayComponent,
    ProviderWaitlistCheckInCancelPopupComponent,
    ProviderWaitlistCheckInConsumerNoteComponent,
    AddProviderWaitlistCheckInProviderNoteComponent,
    AddProviderWaitlistCheckInBillComponent,
    ViewProviderWaitlistCheckInBillComponent,
    ProviderWaitlistCheckInPaymentComponent,
    AddProviderCustomerComponent,
    SearchProviderCustomerComponent,
    ProviderRefundComponent,
    ProviderbWizardComponent,
    AddProviderWaitlistQueuesComponent,
    AddProviderWaitlistServiceComponent,
    GoogleMapComponent,
    ProviderBprofileSearchDynamicComponent
  ],
  providers: [
    AuthGuardProviderHome,
    AuthGuardNewProviderHome,
    SharedServices,
    SharedFunctions,
    ProviderServices,
    ProviderDataStorageService,
    QuestionService,
    MessageService,
    ProviderSharedFuctions,
    ProviderResolver,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: projectConstants.MY_DATE_FORMATS }
  ]

})

export class ProviderModule {}
