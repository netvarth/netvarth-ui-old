import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProviderSettingsRoutingModule } from './provider-settings-routing.module';
import { ProviderSettingsComponent } from './provider-settings.component';
import { ProviderBprofileSearchComponent } from '../provider-bprofile-search/provider-bprofile-search.component';
import { ProviderWaitlistComponent } from '../provider-waitlist/provider-waitlist.component';
import { ProviderDiscountsComponent } from '../provider-discounts/provider-discounts.component';
import { ProviderCouponsComponent } from '../provider-coupons/provider-coupons.component';
import { ViewReportComponent } from '../view-report/view-report.component';
import { ProviderJcouponDetailsComponent } from '../provider-jcoupon-details/provider-jcoupon-details.component';
import { ProviderNonworkingdaysComponent } from '../provider-nonworkingdays/provider-nonworkingdays.component';
import { ProviderItemsComponent } from '../provider-items/provider-items.component';
import { ProviderItemsDetailsComponent } from '../provider-items-details/provider-items-details.component';
import { ProviderWaitlistLocationDetailComponent } from '../provider-waitlist-location-detail/provider-waitlist-location-detail.component';
import { ProviderWaitlistServicesComponent } from '../provider-waitlist-services/provider-waitlist-services.component';
import { ProviderWaitlistServiceDetailComponent } from '../provider-waitlist-service-detail/provider-waitlist-service-detail.component';
import { ProviderWaitlistQueuesComponent } from '../provider-waitlist-queues/provider-waitlist-queues.component';
import { ProviderWaitlistQueueDetailComponent } from '../provider-waitlist-queue-detail/provder-waitlist-queue-detail.component';
import { ProviderLicenseComponent } from '../provider-license/provider-license.component';
import { ProviderPaymentHistoryComponent } from '../provider-payment-history/provider-payment-history.component';
import { ProviderPaymentSettingsComponent } from '../provider-payment-settings/provider-payment-settings.component';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { CheckInModule } from '../../../shared/modules/check-in/check-in.module';
import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';
import { ProviderSubeaderModule } from '../provider-subheader/provider-subheader.module';
import { MaterialModule } from '../../../shared/modules/common/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../loading-spinner/loading-spinner.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { ModalGalleryModule } from 'angular-modal-gallery';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { ProviderWaitlistOnlineCheckinModule } from '../provider-waitlist-online-checkin/provider-waitlist-online-checkin.module';
import { ProviderReimburseReportModule } from '../provider-reimburse-report/provider-reimburse-report.module';
import { ProviderWaitlistLocationsModule } from '../provider-waitlist-locations/provider-waitlist-locations.module';
import { AddProviderBprofileSearchAdwordsComponent } from '../add-provider-bprofile-search-adwords/add-provider-bprofile-search-adwords.component';
import { AddProviderWaitlistLocationsComponent } from '../add-provider-waitlist-locations/add-provider-waitlist-locations.component';
import { ProviderLicenseUsageComponent } from '../provider-license-usage/provider-license-usage.component';
import { AddProviderBprofilePrivacysettingsComponent } from '../provider-bprofile-privacysettings/provider-bprofile-privacysettings.component';
import { ProviderBprofileSearchSchedulepopupComponent } from '../provider-bprofile-search-schedulepopup/provider-bprofile-search-schedulepopup';
import { AddProviderBprofileSpokenLanguagesComponent } from '../add-provider-bprofile-spoken-languages/add-provider-bprofile-spoken-languages.component';
import { AddProviderBprofileSpecializationsComponent } from '../add-provider-bprofile-specializations/add-provider-bprofile-specializations.component';
import { AddProviderWaitlistServiceGalleryComponent } from '../add-provider-waitlist-service-gallery/add-provider-waitlist-service-gallery';
import { AddProviderItemImageComponent } from '../add-provider-item-image/add-provider-item-image.component';
import { AddProviderItemComponent } from '../add-provider-item/add-provider-item.component';
import { UpgradeLicenseComponent } from '../upgrade-license/upgrade-license.component';
import { AddproviderAddonComponent } from '../add-provider-addons/add-provider-addons.component';
import { AddProviderDiscountsComponent } from '../add-provider-discounts/add-provider-discounts.component';
import { AddProviderCouponsComponent } from '../add-provider-coupons/add-provider-coupons.component';
import { AddProviderNonworkingdaysComponent } from '../add-provider-nonworkingdays/add-provider-nonworkingdays.component';
import { ProviderBprofileSearchGalleryComponent } from '../provider-bprofile-search-gallery/provider-bprofile-search-gallery.component';
import { ProviderBprofileSearchPrimaryComponent } from '../provider-bprofile-search-primary/provider-bprofile-search-primary.component';
import { ProviderBprofileSearchSocialMediaComponent } from '../provider-bprofile-search-socialmedia/provider-bprofile-search-socialmedia.component';
import { ProviderAddonAuditlogsComponent } from '../provider-addon-auditlogs/provider-addon-auditlogs.component';
import { ProviderAuditLogComponent } from '../provider-auditlogs/provider-auditlogs.component';
import { ProviderBprofileSearchAdwordsComponent } from '../provider-bprofile-search-adwords/provider-bprofile-search-adwords.component';
import { ProviderLicenceInvoiceDetailComponent } from '../provider-licence-invoice-detail/provider-licence-invoice-detail.component';
import { PagerModule } from '../../../shared/modules/pager/pager.module';
import { AddProviderSchedulesModule } from '../add-provider-schedule/add-provider-schedule.module';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ProviderNotificationsComponent } from '../provider-notifications/provider-notifications.component';
import { ProvidertaxSettingsComponent } from '../provider-tax-settings/provider-tax-settings.component';
import { DepartmentModule } from '../../shared/modules/department/department.module';
import { DepartmentsComponent } from '../departments/departments.component';
import { DepartmentDetailComponent } from '../departments/details/department.details.component';
@NgModule({
    imports: [
        CapitalizeFirstPipeModule,
        ProviderSettingsRoutingModule,
        BreadCrumbModule,
        CheckInModule,
        RouterModule,
        CommonModule,
        ProviderSubeaderModule,
        MaterialModule,
        FormsModule,
        LoadingSpinnerModule,
        Nl2BrPipeModule,
        ModalGalleryModule.forRoot(),
        ReactiveFormsModule,
        FormMessageDisplayModule,
        ProviderWaitlistOnlineCheckinModule,
        ProviderReimburseReportModule,
        ProviderWaitlistLocationsModule,
        PagerModule,
        AddProviderSchedulesModule,
        NgbTimepickerModule,
        DepartmentModule
    ],
    declarations: [
        ProviderSettingsComponent,
        ProviderBprofileSearchComponent,
        ProviderWaitlistComponent,
        ProviderDiscountsComponent,
        ProviderCouponsComponent,
        ViewReportComponent,
        ProviderJcouponDetailsComponent,
        ProviderNonworkingdaysComponent,
        ProviderItemsComponent,
        ProviderItemsDetailsComponent,
        ProviderWaitlistLocationDetailComponent,
        ProviderWaitlistServicesComponent,
        ProviderWaitlistServiceDetailComponent,
        ProviderWaitlistQueuesComponent,
        ProviderWaitlistQueueDetailComponent,
        ProviderLicenseComponent,
        ProviderPaymentHistoryComponent,
        ProviderPaymentSettingsComponent,
        AddProviderBprofileSearchAdwordsComponent,
        AddProviderWaitlistLocationsComponent,
        ProviderLicenseUsageComponent,
        AddProviderBprofilePrivacysettingsComponent,
        ProviderBprofileSearchSchedulepopupComponent,
        AddProviderBprofileSpokenLanguagesComponent,
        AddProviderBprofileSpecializationsComponent,
        AddProviderWaitlistServiceGalleryComponent,
        AddProviderItemImageComponent,
        AddProviderItemComponent,
        UpgradeLicenseComponent,
        AddproviderAddonComponent,
        ProviderAuditLogComponent,
        ProviderAddonAuditlogsComponent,
        AddProviderDiscountsComponent,
        AddProviderCouponsComponent,
        AddProviderNonworkingdaysComponent,
        AddProviderCouponsComponent,
        ProviderBprofileSearchPrimaryComponent,
        // ProviderBprofileSearchDynamicComponent,
        ProviderBprofileSearchGalleryComponent,
        ProviderBprofileSearchSocialMediaComponent,
        ProviderBprofileSearchAdwordsComponent,
        // VirtualFieldsComponent,
        // DynamicFormQuestionComponent,
        // DynamicFormComponent,
        ProviderLicenceInvoiceDetailComponent,
        ProviderNotificationsComponent,
        ProvidertaxSettingsComponent,
        DepartmentsComponent,
        DepartmentDetailComponent
    ],
    entryComponents: [
        AddProviderItemComponent,
        UpgradeLicenseComponent,
        AddproviderAddonComponent,
        AddProviderDiscountsComponent,
        AddProviderCouponsComponent,
        AddProviderNonworkingdaysComponent,
        AddProviderBprofileSearchAdwordsComponent,
        AddProviderWaitlistLocationsComponent,
        ProviderLicenseUsageComponent,
        AddProviderBprofilePrivacysettingsComponent,
        ProviderBprofileSearchPrimaryComponent,
        ProviderBprofileSearchSocialMediaComponent,
        ProviderBprofileSearchGalleryComponent,
        ProviderBprofileSearchSchedulepopupComponent,
        AddProviderBprofileSpokenLanguagesComponent,
        AddProviderBprofileSpecializationsComponent,
        // ProviderBprofileSearchDynamicComponent,
        AddProviderWaitlistServiceGalleryComponent,
        AddProviderItemImageComponent,
        ProviderAddonAuditlogsComponent,
        ProviderLicenceInvoiceDetailComponent,
        ProviderAuditLogComponent
    ]
})

export class ProviderSettingsModule { }

