import { ProviderWaitlistCheckInDetailComponent } from './provider-waitlist-checkin-detail.component';
import { NgModule } from '@angular/core';
import { ProviderWaitlistCheckInDetailRoutingModule } from './provider-waitlist-checkin-detail.routing.module';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
import { LoadingSpinnerModule } from '../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { CommonModule } from '@angular/common';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { SharedModule } from '../../../../shared/modules/common/shared.module';
import { InboxModule } from '../../../../shared/modules/inbox/inbox.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';

@NgModule({
    imports: [
        ProviderWaitlistCheckInDetailRoutingModule,
        BreadCrumbModule,
        LoadingSpinnerModule,
        CommonModule,
        CapitalizeFirstPipeModule,
        InboxModule,
        SharedModule,
        Nl2BrPipeModule
    ],
    declarations: [
        ProviderWaitlistCheckInDetailComponent
    ],
    exports: [ProviderWaitlistCheckInDetailComponent]
})
export class ProviderWaitlistCheckInDetailModule {
}
