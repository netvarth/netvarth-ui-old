import { NgModule } from '@angular/core';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../shared/modules/common/material.module';
import { ConsumerDonationRoutingModule } from './consumer-donation.routing.module';
import { LoadingSpinnerModule } from '../../../shared/modules/loading-spinner/loading-spinner.module';
import { CheckinAddMemberModule } from '../../../shared/modules/checkin-add-member/checkin-add-member.module';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { OwlModule } from 'ngx-owl-carousel';
import { ConsumerDonationsComponent } from './donations.component';
import { ConsumerDonationComponent } from './details/consumer-donation.component';
import { HeaderModule } from '../../../shared/modules/header/header.module';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ConfirmPageComponent } from './details/confirm-page/confirm-page.component';

@NgModule({
    declarations: [
        ConsumerDonationComponent,
        ConsumerDonationsComponent,
        ConfirmPageComponent
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
        HeaderModule,
        NgxIntlTelInputModule

    ],
    exports: [ConsumerDonationsComponent]
})
export class ConsumerDonationModule {}
