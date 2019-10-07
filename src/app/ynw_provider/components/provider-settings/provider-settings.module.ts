import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProviderSettingsRoutingModule } from './provider-settings-routing.module';
import { ProviderSettingsComponent } from './provider-settings.component';
import { ProviderBprofileSearchComponent } from '../provider-bprofile-search/provider-bprofile-search.component';
import { ProviderWaitlistComponent } from '../provider-waitlist/provider-waitlist.component';
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
import { ProviderWaitlistLocationsModule } from '../provider-waitlist-locations/provider-waitlist-locations.module';
import { AddProviderWaitlistLocationsComponent } from '../add-provider-waitlist-locations/add-provider-waitlist-locations.component';
// import { ProviderLicenseUsageComponent } from '../provider-license-usage/provider-license-usage.component';
import { AddProviderBprofilePrivacysettingsComponent } from '../provider-bprofile-privacysettings/provider-bprofile-privacysettings.component';
import { ProviderBprofileSearchSchedulepopupComponent } from '../provider-bprofile-search-schedulepopup/provider-bprofile-search-schedulepopup';
import { AddProviderBprofileSpecializationsComponent } from '../add-provider-bprofile-specializations/add-provider-bprofile-specializations.component';
import { AddProviderWaitlistServiceGalleryComponent } from '../add-provider-waitlist-service-gallery/add-provider-waitlist-service-gallery';
import { ProviderBprofileSearchGalleryComponent } from '../provider-bprofile-search-gallery/provider-bprofile-search-gallery.component';
import { ProviderBprofileSearchPrimaryComponent } from '../provider-bprofile-search-primary/provider-bprofile-search-primary.component';
import { ProviderBprofileSearchSocialMediaComponent } from '../provider-bprofile-search-socialmedia/provider-bprofile-search-socialmedia.component';
// import { ProviderAuditLogComponent } from '../provider-auditlogs/provider-auditlogs.component';
import { ProviderLicenceInvoiceDetailComponent } from '../provider-licence-invoice-detail/provider-licence-invoice-detail.component';
import { PagerModule } from '../../../shared/modules/pager/pager.module';
import { AddProviderSchedulesModule } from '../add-provider-schedule/add-provider-schedule.module';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
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
        // ProviderWaitlistServicesComponent,
        // ProviderWaitlistServiceDetailComponent,

        AddProviderWaitlistLocationsComponent,
        // ProviderLicenseUsageComponent,
        AddProviderBprofilePrivacysettingsComponent,
        ProviderBprofileSearchSchedulepopupComponent,
        // AddProviderBprofileSpokenLanguagesComponent,
        AddProviderBprofileSpecializationsComponent,
        AddProviderWaitlistServiceGalleryComponent,
        // UpgradeLicenseComponent,
        // ProviderAuditLogComponent,
        ProviderBprofileSearchPrimaryComponent,
        // ProviderBprofileSearchDynamicComponent,
        ProviderBprofileSearchGalleryComponent,
        ProviderBprofileSearchSocialMediaComponent,
        // ProviderBprofileSearchAdwordsComponent,
        // VirtualFieldsComponent,
        // DynamicFormQuestionComponent,
        // DynamicFormComponent,
        // ProviderLicenceInvoiceDetailComponent
    ],
    entryComponents: [
        // UpgradeLicenseComponent,
        AddProviderWaitlistLocationsComponent,
        // ProviderLicenseUsageComponent,
        AddProviderBprofilePrivacysettingsComponent,
        ProviderBprofileSearchPrimaryComponent,
        ProviderBprofileSearchSocialMediaComponent,
        ProviderBprofileSearchGalleryComponent,
        ProviderBprofileSearchSchedulepopupComponent,
        // AddProviderBprofileSpokenLanguagesComponent,
        AddProviderBprofileSpecializationsComponent,
        // ProviderBprofileSearchDynamicComponent,
        AddProviderWaitlistServiceGalleryComponent,
        // ProviderLicenceInvoiceDetailComponent,
        // ProviderAuditLogComponent
    ]
})

export class ProviderSettingsModule { }

