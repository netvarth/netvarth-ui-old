import { NgModule } from '@angular/core';
import { ConsumerDonationComponent } from './consumer-donation.component';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/common/material.module';
import { ConsumerDonationRoutingModule } from './consumer-donation.routing.module';
import { LoadingSpinnerModule } from '../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { CheckinAddMemberModule } from '../../../../shared/modules/checkin-add-member/checkin-add-member.module';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { OwlModule } from 'ngx-owl-carousel';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
import { ConsumerDonationPaymentComponent } from './payment/payment.component';

@NgModule({
    declarations: [
        ConsumerDonationComponent,
        ConsumerDonationPaymentComponent
    ],
    imports: [
        FormMessageDisplayModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        CheckinAddMemberModule,
        ConsumerDonationRoutingModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        Nl2BrPipeModule,
        OwlModule,
        BreadCrumbModule
    ],
    exports: [ConsumerDonationComponent]
})
export class ConsumerDonationModule {}
