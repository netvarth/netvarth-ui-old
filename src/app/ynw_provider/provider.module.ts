import { NgModule } from '@angular/core';
import { CKEditorModule } from 'ng2-ckeditor';
import { SharedModule } from '../shared/modules/common/shared.module';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ModalGalleryModule } from 'angular-modal-gallery';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { ProviderRouterModule } from './provider-routing.module';
import { HeaderModule } from '../shared/modules/header/header.module';
import { PagerModule } from '../shared/modules/pager/pager.module';
import { CheckInModule } from '../shared/modules/check-in/check-in.module';

import { ProviderComponent } from './provider.component';
import { ProviderHomeComponent } from './components/home/provider-home.component';
import { ProviderProfileComponent } from './components/provider-profile/provider-profile.component';
import { ProviderTourComponent } from './components/provider-tour/provider-tour.component';
import { ProviderSettingsComponent } from './components/provider-settings/provider-settings.component';
import { ProviderMembersComponent } from './components/provider-members/provider-members.component';
import { ProviderItemsComponent } from './components/provider-items/provider-items.component';
import { ProviderDiscountsComponent } from './components/provider-discounts/provider-discounts.component';
import { ProviderCouponsComponent } from './components/provider-coupons/provider-coupons.component';
import { ProviderItemsDetailsComponent } from './components/provider-items-details/provider-items-details.component';
import { ConfirmBoxComponent} from './shared/component/confirm-box/confirm-box.component';
import { NotificationListBoxComponent} from './shared/component/notification-list-box/notification-list-box.component';
import { AddProviderMemberComponent } from './components/add-provider-member/add-provider-member.component';
import { AddProviderItemComponent } from './components/add-provider-item/add-provider-item.component';
import { AddProviderDiscountsComponent } from './components/add-provider-discounts/add-provider-discounts.component';
import { AddProviderCouponsComponent } from './components/add-provider-coupons/add-provider-coupons.component';
import { VirtualFieldsComponent } from './components/virtual-fields/virtual-fields.component';
import { ProviderLicenseComponent } from './components/provider-license/provider-license.component';
import { UpgradeLicenseComponent } from './components/upgrade-license/upgrade-license.component';
import { AddproviderAddonComponent  } from './components/add-provider-addons/add-provider-addons.component';
import { ProviderAuditLogComponent } from './components/provider-auditlogs/provider-auditlogs.component';
import { ProviderNonworkingdaysComponent } from './components/provider-nonworkingdays/provider-nonworkingdays.component';
import { AddProviderNonworkingdaysComponent } from './components/add-provider-nonworkingdays/add-provider-nonworkingdays.component';
import { ProviderBprofileSearchComponent } from './components/provider-bprofile-search/provider-bprofile-search.component';
import { ProviderBprofileSearchPrimaryComponent } from './components/provider-bprofile-search-primary/provider-bprofile-search-primary.component';
import { ProviderBprofileSearchDynamicComponent } from './components/provider-bprofile-search-dynamic/provider-bprofile-search-dynamic.component';
import { ProviderBprofileSearchGalleryComponent } from './components/provider-bprofile-search-gallery/provider-bprofile-search-gallery.component';
import { ProviderBprofileSearchSocialMediaComponent } from './components/provider-bprofile-search-socialmedia/provider-bprofile-search-socialmedia.component';
import { ProviderBprofileSearchAdwordsComponent } from './components/provider-bprofile-search-adwords/provider-bprofile-search-adwords.component';
import { AddProviderSchedulesComponent } from './components/add-provider-schedule/add-provider-schedule.component';
import { ProviderWaitlistComponent } from './components/provider-waitlist/provider-waitlist.component';
import { ProviderWaitlistLocationsComponent } from './components/provider-waitlist-locations/provider-waitlist-locations.component';
import { ProviderWaitlistQueuesComponent } from './components/provider-waitlist-queues/provider-waitlist-queues.component';
import { ProviderWaitlistServicesComponent } from './components/provider-waitlist-services/provider-waitlist-services.component';
import { ProviderWaitlistOnlineCheckinComponent } from './components/provider-waitlist-online-checkin/provider-waitlist-online-checkin.component';
import { AddProviderBprofileSearchAdwordsComponent } from './components/add-provider-bprofile-search-adwords/add-provider-bprofile-search-adwords.component';
import { AddProviderWaitlistLocationsComponent } from './components/add-provider-waitlist-locations/add-provider-waitlist-locations.component';
import { AddProviderWaitlistServiceComponent } from './components/add-provider-waitlist-service/add-provider-waitlist-service.component';
import { ProviderLicenseUsageComponent } from './components/provider-license-usage/provider-license-usage.component';
import { AddProviderWaitlistQueuesComponent } from './components/add-provider-waitlist-queues/add-provider-waitlist-queues.component';
// import { ProviderInboxComponent } from './components/provider-inbox/provider-inbox.component';
// import { ProviderInboxReplyComponent } from './components/provider-inbox-reply/provider-inbox-reply.component';
// import { AddProviderInboxMessageComponent } from './components/add-provider-inbox-message/add-provider-inbox-message.component';
import { AdjustQueueDelayComponent } from './components/adjust-queue-delay/adjust-queue-delay.component';
import { GoogleMapComponent } from './components/googlemap/googlemap.component';
import { ProviderbWizardComponent } from './components/provider-bwizard/provider-bwizard.component';
import { AuthGuardProviderHome, AuthGuardNewProviderHome } from '../shared/guard/auth.guard';
import { ProviderSubeaderComponent } from './components/provider-subheader/provider-subheader.component';
import { AddProviderBprofilePrivacysettingsComponent } from './components/provider-bprofile-privacysettings/provider-bprofile-privacysettings.component';
import { ProviderBprofileSearchSchedulepopupComponent } from './components/provider-bprofile-search-schedulepopup/provider-bprofile-search-schedulepopup';
import { AddProviderBprofileSpokenLanguagesComponent } from './components/add-provider-bprofile-spoken-languages/add-provider-bprofile-spoken-languages.component';
import { AddProviderBprofileSpecializationsComponent } from './components/add-provider-bprofile-specializations/add-provider-bprofile-specializations.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ProviderWaitlistLocationDetailComponent } from './components/provider-waitlist-location-detail/provider-waitlist-location-detail.component';
import { ProviderWaitlistServiceDetailComponent } from './components/provider-waitlist-service-detail/provider-waitlist-service-detail.component';
import { ProviderWaitlistQueueDetailComponent } from './components/provider-waitlist-queue-detail/provder-waitlist-queue-detail.component';
import { AddProviderWaitlistServiceGalleryComponent } from './components/add-provider-waitlist-service-gallery/add-provider-waitlist-service-gallery';
import { ProviderWaitlistCheckInCancelPopupComponent } from './components/provider-waitlist-checkin-cancel-popup/provider-waitlist-checkin-cancel-popup.component';
import { AddProviderItemImageComponent } from './components/add-provider-item-image/add-provider-item-image.component';
import { ProviderWaitlistCheckInConsumerNoteComponent } from './components/provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.component';
import { ProviderPaymentHistoryComponent } from './components/provider-payment-history/provider-payment-history.component';
import {ProviderLicenceInvoiceDetailComponent } from './components/provider-licence-invoice-detail/provider-licence-invoice-detail.component';
import { ProviderWaitlistCheckInDetailComponent } from './components/provider-waitlist-checkin-detail/provider-waitlist-checkin-detail.component';
import { AddProviderWaitlistCheckInProviderNoteComponent } from './components/add-provider-waitlist-checkin-provider-note/add-provider-waitlist-checkin-provider-note.component';
import { AddProviderWaitlistCheckInBillComponent } from './components/add-provider-waitlist-checkin-bill/add-provider-waitlist-checkin-bill.component';
import { ProviderPaymentSettingsComponent  } from './components/provider-payment-settings/provider-payment-settings.component';
import { ViewProviderWaitlistCheckInBillComponent } from './components/view-provider-waitlist-checkin-bill/view-provider-waitlist-checkin-bill.component';
import { ProviderWaitlistCheckInPaymentComponent } from './components/provider-waitlist-checkin-payment/provider-waitlist-checkin-payment.component';
import { ProviderSystemAuditLogComponent  } from './components/provider-system-auditlogs/provider-system-auditlogs.component';
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
// import { BreadCrumbComponent } from '../shared/components/breadcrumb/breadcrumb.component';
import { ProviderSharedFuctions } from './shared/functions/provider-shared-functions';
import { ProviderResolver } from './services/provider-resolver.service';

import { DynamicFormQuestionComponent } from './components/dynamicforms/dynamic-form-question.component';
import { DynamicFormComponent } from './components/dynamicforms/dynamic-form.component';
import { QuestionService } from './components/dynamicforms/dynamic-form-question.service';
import { projectConstants } from '../shared/constants/project-constants';

import { BreadCrumbModule } from '../shared/modules/breadcrumb/breadcrumb.module';
// import { ChangePasswordModule } from '../shared/modules/change-password/change-password.module';
// import { ChangeMobileModule } from '../shared/modules/change-mobile/change-mobile.module';
import { InboxModule } from '../shared/modules/inbox/inbox.module';
import { ViewBillModule } from '../shared/modules/view-bill/view-bill.module';
import { LearnmoreModule } from '../shared/modules/learnmore/learnmore.module';

import {Nl2BrPipeModule} from 'nl2br-pipe';


import 'hammerjs';
import 'mousetrap';

@NgModule({
    imports: [
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
        LearnmoreModule,
        Nl2BrPipeModule
    ],
    declarations: [
        ProviderComponent,
        ProviderHomeComponent,
        ProviderProfileComponent,
        ProviderSettingsComponent,
        ProviderTourComponent,
        ProviderBprofileSearchComponent,
        ProviderMembersComponent,
        AddProviderMemberComponent,
        AddProviderItemComponent,
        ProviderDiscountsComponent,
        ProviderCouponsComponent,
        ConfirmBoxComponent,
        NotificationListBoxComponent,
        ProviderItemsComponent,
        ProviderItemsDetailsComponent,
        VirtualFieldsComponent,
        DynamicFormQuestionComponent,
        DynamicFormComponent,
        ProviderLicenseComponent,
        UpgradeLicenseComponent,
        AddproviderAddonComponent,
        ProviderAuditLogComponent,
        AddProviderDiscountsComponent,
        AddProviderCouponsComponent,
        ProviderNonworkingdaysComponent,
        AddProviderNonworkingdaysComponent,
        AddProviderCouponsComponent,
        ProviderBprofileSearchPrimaryComponent,
        ProviderBprofileSearchDynamicComponent,
        ProviderBprofileSearchGalleryComponent,
        ProviderBprofileSearchSocialMediaComponent,
        ProviderBprofileSearchAdwordsComponent,
        AddProviderSchedulesComponent,
        ProviderWaitlistComponent,
        ProviderWaitlistLocationsComponent,
        ProviderWaitlistQueuesComponent,
        ProviderWaitlistServicesComponent,
        ProviderWaitlistOnlineCheckinComponent,
        AddProviderBprofileSearchAdwordsComponent,
        AddProviderWaitlistLocationsComponent,
        AddProviderWaitlistServiceComponent,
        ProviderLicenseUsageComponent,
        AddProviderWaitlistServiceComponent,
        AddProviderWaitlistQueuesComponent,
        // ProviderInboxComponent,
        // AddProviderInboxMessageComponent,
        AdjustQueueDelayComponent,
        GoogleMapComponent,
        ProviderbWizardComponent,
        ProviderSubeaderComponent,
        AddProviderBprofilePrivacysettingsComponent,
        ProviderBprofileSearchSchedulepopupComponent,
        AddProviderBprofileSpokenLanguagesComponent,
        AddProviderBprofileSpecializationsComponent,
        LoadingSpinnerComponent,
        ProviderWaitlistLocationDetailComponent,
        ProviderWaitlistServiceDetailComponent,
        ProviderWaitlistQueueDetailComponent,
        AddProviderWaitlistServiceGalleryComponent,
        ProviderWaitlistCheckInCancelPopupComponent,
        AddProviderItemImageComponent,
        ProviderWaitlistCheckInConsumerNoteComponent,
        ProviderPaymentHistoryComponent,
        ProviderLicenceInvoiceDetailComponent,
        ProviderWaitlistCheckInDetailComponent,
        AddProviderWaitlistCheckInProviderNoteComponent,
        AddProviderWaitlistCheckInBillComponent,
        ProviderPaymentSettingsComponent,
        ViewProviderWaitlistCheckInBillComponent,
        ProviderWaitlistCheckInPaymentComponent,
        ProviderSystemAuditLogComponent,
        ProviderSystemAlertComponent,
        ProviderCustomersComponent,
        AddProviderCustomerComponent,
        SearchProviderCustomerComponent,
        ProviderRefundComponent
    ],
    exports: [ConfirmBoxComponent],
    entryComponents: [
      ConfirmBoxComponent,
      NotificationListBoxComponent,
      AddProviderMemberComponent,
      AddProviderItemComponent,
      UpgradeLicenseComponent,
      AddproviderAddonComponent,
      AddProviderDiscountsComponent,
      AddProviderCouponsComponent,
      AddProviderNonworkingdaysComponent,
      AddProviderBprofileSearchAdwordsComponent,
      AddProviderWaitlistLocationsComponent,
      AddProviderWaitlistServiceComponent,
      ProviderLicenseUsageComponent,
      AddProviderWaitlistQueuesComponent,
      // AddProviderInboxMessageComponent,
      AdjustQueueDelayComponent,
      GoogleMapComponent,
      ProviderBprofileSearchPrimaryComponent,
      AddProviderBprofilePrivacysettingsComponent,
      ProviderBprofileSearchSocialMediaComponent,
      ProviderBprofileSearchGalleryComponent,
      ProviderBprofileSearchSchedulepopupComponent,
      AddProviderBprofileSpokenLanguagesComponent,
      AddProviderBprofileSpecializationsComponent,
      ProviderBprofileSearchDynamicComponent,
      AddProviderWaitlistServiceGalleryComponent,
      ProviderWaitlistCheckInCancelPopupComponent,
      AddProviderItemImageComponent,
      ProviderWaitlistCheckInConsumerNoteComponent,
      ProviderAuditLogComponent,
      ProviderLicenceInvoiceDetailComponent,
      AddProviderWaitlistCheckInProviderNoteComponent,
      AddProviderWaitlistCheckInBillComponent,
      ViewProviderWaitlistCheckInBillComponent,
      ProviderWaitlistCheckInPaymentComponent,
      AddProviderCustomerComponent,
      SearchProviderCustomerComponent,
      ProviderRefundComponent
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
      {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
      {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
      {provide: MAT_DATE_FORMATS, useValue: projectConstants.MY_DATE_FORMATS}
    ]

})

export class ProviderModule {

}



