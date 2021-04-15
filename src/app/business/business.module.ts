import { NgModule } from '@angular/core';
import { MenuComponent } from './home/menu/menu.component';
import { FooterNewComponent } from './home/footer/footer.component';
import { BusinessHeaderComponent } from './home/header/header.component';
import { BusinessHomeComponent } from './home/business-home.component';
import { RouterModule } from '@angular/router';
import { BusinessRoutingModule } from './business-routing.module';
import { AuthGuardProviderHome, AuthGuardNewProviderHome } from '../shared/guard/auth.guard';
import { SharedServices } from '../shared/services/shared-services';
import { SharedFunctions } from '../shared/functions/shared-functions';
import { ProviderServices } from '../ynw_provider/services/provider-services.service';
import { ProviderDataStorageService } from '../ynw_provider/services/provider-datastorage.service';
import { QuestionService } from '../ynw_provider/components/dynamicforms/dynamic-form-question.service';
import { MessageService } from '../ynw_provider/services/provider-message.service';
import { ProviderSharedFuctions } from '../ynw_provider/shared/functions/provider-shared-functions';
import { ProviderResolver } from '../ynw_provider/services/provider-resolver.service';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { projectConstants } from '../app.component';
import { ProviderFaqModule } from './modules/faq/provider-faq.module';
import { BusinessComponent } from './business.component';
import { BreadCrumbModule } from '../shared/modules/breadcrumb/breadcrumb.module';
import { CommonModule } from '@angular/common';
import { CapitalizeFirstPipeModule } from '../shared/pipes/capitalize.module';
import { MaterialModule } from '../shared/modules/common/material.module';
import { SharedModule } from '../shared/modules/common/shared.module';
import { PagerModule } from '../shared/modules/pager/pager.module';
import { LoadingSpinnerModule } from '../shared/modules/loading-spinner/loading-spinner.module';
import { ProviderSystemAuditLogComponent } from '../ynw_provider/components/provider-system-auditlogs/provider-system-auditlogs.component';
import { ProviderSystemAlertComponent } from '../ynw_provider/components/provider-system-alerts/provider-system-alerts.component';
import { AddProviderBprofileSearchAdwordsComponent } from '../ynw_provider/components/add-provider-bprofile-search-adwords/add-provider-bprofile-search-adwords.component';
import { AddProviderWaitlistCheckInBillComponent } from './modules/check-ins/add-provider-waitlist-checkin-bill/add-provider-waitlist-checkin-bill.component';
import { InboxModule } from '../shared/modules/inbox/inbox.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { GoogleMapComponent } from '../ynw_provider/components/googlemap/googlemap.component';
import { ProviderbWizardComponent } from '../ynw_provider/components/provider-bwizard/provider-bwizard.component';
import { AddProviderSchedulesModule } from '../ynw_provider/components/add-provider-schedule/add-provider-schedule.module';
import { DynamicFormModule } from './modules/dynamic-form/dynamic-form.module';
import { ConfirmBoxComponent } from '../ynw_provider/shared/component/confirm-box/confirm-box.component';
import { ConfirmPaymentBoxComponent } from '../ynw_provider/shared/component/confirm-paymentbox/confirm-paymentbox.component';
import { ProviderWaitlistCheckInCancelPopupComponent } from './modules/check-ins/provider-waitlist-checkin-cancel-popup/provider-waitlist-checkin-cancel-popup.component';
import { ShowMessageComponent } from './modules/show-messages/show-messages.component';
import { ConfirmPatmentLinkComponent } from '../ynw_provider/shared/component/confirm-paymentlink/confirm-paymentlink.component';
import { JoyrideModule } from 'ngx-joyride';
import { ProviderStartTourComponent } from '../ynw_provider/components/provider-start-tour/provider-start-tour.component';
import { UpdateEmailComponent } from './modules/update-email/update-email.component';
import { HelpPopUpComponent } from './home/header/help-pop-up/help-pop-up.component';
import { ShoppinglistuploadComponent } from '../shared/components/shoppinglistupload/shoppinglistupload.component';
import { InboxListModule } from './modules/inbox-list/inbox-list.module';
import { ServiceListDialogComponent } from './shared/service-list-dialog/service-list-dialog.component';
import { DepartmentListDialogComponent } from './shared/department-list-dialog/department-list-dialog.component';
import { UsersListDialogComponent } from './shared/users-list-dialog/users-list-dialog.component';
import { ConsumerGroupDialogComponent } from './shared/consumer-group-dialog/consumer-group-dialog.component';
import { ItemListDialogComponent } from './shared/item-list-dialog/item-list-dialog.component';
import { ConsumerLabelDialogComponent } from './shared/consumer-label-dialog/consumer-label-dialog.component';
import { EnquiryComponent } from './modules/enquiry/enquiry.component';
import { DshortcutsComponent } from './modules/dshortcuts/dshortcuts.component';
import { DcalanderComponent } from './modules/dcalander/dcalander.component';
import { DstatsComponent } from './modules/dstats/dstats.component';
import { DfeedsComponent } from './modules/dfeeds/dfeeds.component';

@NgModule({
    declarations: [
        MenuComponent,
        BusinessHeaderComponent,
        FooterNewComponent,
        BusinessHomeComponent,
        BusinessComponent,
        ProviderSystemAuditLogComponent,
        ProviderSystemAlertComponent,
        AddProviderBprofileSearchAdwordsComponent,
        AddProviderWaitlistCheckInBillComponent,
        GoogleMapComponent,
        ProviderbWizardComponent,
        ConfirmBoxComponent,
        ConfirmPaymentBoxComponent,
        ConfirmPatmentLinkComponent,
        ProviderWaitlistCheckInCancelPopupComponent,
        ShowMessageComponent,
        ProviderStartTourComponent,
        UpdateEmailComponent,
        HelpPopUpComponent,
        ShoppinglistuploadComponent,
        ServiceListDialogComponent,
        DepartmentListDialogComponent,
        UsersListDialogComponent,
        ConsumerGroupDialogComponent,
        ItemListDialogComponent,
        ConsumerLabelDialogComponent,
        EnquiryComponent,
        DshortcutsComponent,
        DcalanderComponent,
        DstatsComponent,
        DfeedsComponent
    ],
    imports: [
        BusinessRoutingModule,
        RouterModule,
        ProviderFaqModule,
        BreadCrumbModule,
        CommonModule,
        CapitalizeFirstPipeModule,
        MaterialModule,
        SharedModule,
        PagerModule,
        LoadingSpinnerModule,
        InboxModule,
        Nl2BrPipeModule,
        AddProviderSchedulesModule,
        DynamicFormModule,
        JoyrideModule.forChild(),
        InboxListModule
    ],
    entryComponents: [
        AddProviderWaitlistCheckInBillComponent,
        AddProviderBprofileSearchAdwordsComponent,
        GoogleMapComponent,
        ConfirmBoxComponent,
        ConfirmPaymentBoxComponent,
        ConfirmPatmentLinkComponent,
        ProviderWaitlistCheckInCancelPopupComponent,
        ShowMessageComponent,
        ProviderStartTourComponent,
        UpdateEmailComponent,
        HelpPopUpComponent,
        ShoppinglistuploadComponent
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

export class BusinessModule {

}
