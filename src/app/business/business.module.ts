import { NgModule } from '@angular/core';
import { MenuComponent } from './home/menu/menu.component';
import { FooterNewComponent } from './home/footer/footer.component';
import { SettingsComponent } from './home/settings/settings.component';
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
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { projectConstants } from '../app.component';
import { ProviderFaqModule } from './modules/faq/provider-faq.module';
import { KioskModule } from '../ynw_kiosk/kiosk.module';
import { BusinessComponent } from './business.component';
import { ProviderCustomersComponent } from '../ynw_provider/components/provider-customers/provider-customers.component';
import { BreadCrumbModule } from '../shared/modules/breadcrumb/breadcrumb.module';
import { CommonModule } from '@angular/common';
import { CapitalizeFirstPipeModule } from '../shared/pipes/capitalize.module';
import { MaterialModule } from '../shared/modules/common/material.module';
import { SharedModule } from '../shared/modules/common/shared.module';
import { PagerModule } from '../shared/modules/pager/pager.module';
import { LoadingSpinnerModule } from '../ynw_provider/components/loading-spinner/loading-spinner.module';
import { ProviderSystemAuditLogComponent } from '../ynw_provider/components/provider-system-auditlogs/provider-system-auditlogs.component';
import { ProviderSystemAlertComponent } from '../ynw_provider/components/provider-system-alerts/provider-system-alerts.component';
import { AddProviderWaitlistQueuesComponent } from '../ynw_provider/components/add-provider-waitlist-queues/add-provider-waitlist-queues.component';
import { AddProviderBprofileSearchAdwordsComponent } from '../ynw_provider/components/add-provider-bprofile-search-adwords/add-provider-bprofile-search-adwords.component';
import { AddProviderWaitlistCheckInBillComponent } from './modules/check-ins/add-provider-waitlist-checkin-bill/add-provider-waitlist-checkin-bill.component';
import { InboxModule } from '../shared/modules/inbox/inbox.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { GoogleMapComponent } from '../ynw_provider/components/googlemap/googlemap.component';
import { ProviderbWizardComponent } from '../ynw_provider/components/provider-bwizard/provider-bwizard.component';
import { AddProviderSchedulesModule } from '../ynw_provider/components/add-provider-schedule/add-provider-schedule.module';
import { DynamicFormModule } from './modules/dynamic-form/dynamic-form.module';
import { ConfirmBoxComponent } from '../ynw_provider/shared/component/confirm-box/confirm-box.component';
import { ProviderMembersComponent } from '../ynw_provider/components/provider-members/provider-members.component';
import { AddProviderMemberComponent } from '../ynw_provider/components/add-provider-member/add-provider-member.component';
import { ConfirmPaymentBoxComponent } from '../ynw_provider/shared/component/confirm-paymentbox/confirm-paymentbox.component';
import { CustomerModule } from './modules/customer/customer.module';
import { ProviderWaitlistCheckInCancelPopupComponent } from './modules/check-ins/provider-waitlist-checkin-cancel-popup/provider-waitlist-checkin-cancel-popup.component';
import { ProviderErrorMesagePopupComponent } from './modules/provider-error-message-popup/provider-error-message-popup.component';
import { ConfirmPatmentLinkComponent } from '../ynw_provider/shared/component/confirm-paymentlink/confirm-paymentlink.component';
import { JoyrideModule } from 'ngx-joyride';
import { ProviderStartTourComponent } from '../ynw_provider/components/provider-start-tour/provider-start-tour.component';
import { UpdateEmailComponent } from './modules/update-email/update-email.component';

@NgModule({
    declarations: [
        MenuComponent,
        BusinessHeaderComponent,
        FooterNewComponent,
        SettingsComponent,
        BusinessHomeComponent,
        BusinessComponent,
        ProviderCustomersComponent,
        ProviderSystemAuditLogComponent,
        ProviderSystemAlertComponent,
        AddProviderWaitlistQueuesComponent,
        AddProviderBprofileSearchAdwordsComponent,
        AddProviderWaitlistCheckInBillComponent,
        // ProviderWaitlistCheckInDetailComponent,
        GoogleMapComponent,
        ProviderbWizardComponent,
        ConfirmBoxComponent,
        ProviderMembersComponent,
        AddProviderMemberComponent,
        ConfirmPaymentBoxComponent,
        ConfirmPatmentLinkComponent,
        ProviderWaitlistCheckInCancelPopupComponent,
        ProviderErrorMesagePopupComponent,
        ProviderStartTourComponent,
        UpdateEmailComponent
    ],
    imports: [
        BusinessRoutingModule,
        RouterModule,
        ProviderFaqModule,
        KioskModule,
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
        CustomerModule,
        JoyrideModule.forChild()
    ],
    entryComponents: [
        AddProviderWaitlistQueuesComponent,
        AddProviderWaitlistCheckInBillComponent,
        AddProviderBprofileSearchAdwordsComponent,
        GoogleMapComponent,
        ConfirmBoxComponent,
        AddProviderMemberComponent,
        ConfirmPaymentBoxComponent,
        ConfirmPatmentLinkComponent,
        ProviderWaitlistCheckInCancelPopupComponent,
        ProviderErrorMesagePopupComponent,
        ProviderStartTourComponent,
        UpdateEmailComponent
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
