import { NgModule } from '@angular/core';
import { ConsumerCheckinComponent } from './consumer-checkin.component';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/common/material.module';
import { ConsumerCheckinRoutingModule } from './consumer-checkin.routing.module';
import { LoadingSpinnerModule } from '../../../../shared/modules/loading-spinner/loading-spinner.module';
import { CheckinAddMemberModule } from '../../../../shared/modules/checkin-add-member/checkin-add-member.module';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { OwlModule } from 'ngx-owl-carousel';
import { ConsumerPaymentComponent } from './payment/payment.component';
import { ConsumerLiveTrackComponent } from './livetrack/livetrack.component';
import { ConsumerCheckinHistoryComponent } from './history/checkin-history.component';
import { PagerModule } from '../../../../shared/modules/pager/pager.module';
import { ConsumerCheckinBillComponent } from './checkin-bill/checkin-bill.component';
import { HeaderModule } from '../../../../shared/modules/header/header.module';
import { ConfirmPageComponent } from './confirm-page/confirm-page.component';
import { CheckinConfirmPopupComponent } from './checkin-confirm-popup/checkin-confirm-popup.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { QuestionnaireModule } from '../../../../shared/components/questionnaire/questionnaire.module';

@NgModule({
    declarations: [
        ConsumerCheckinComponent,
        ConsumerPaymentComponent,
        ConsumerLiveTrackComponent,
        ConsumerCheckinHistoryComponent,
        ConsumerCheckinBillComponent,
        ConfirmPageComponent,
        CheckinConfirmPopupComponent
    ],
    imports: [
        FormMessageDisplayModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        CheckinAddMemberModule,
        ConsumerCheckinRoutingModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        Nl2BrPipeModule,
        OwlModule,
        PagerModule,
        HeaderModule,
        NgxIntlTelInputModule,
        QuestionnaireModule
    ],
    entryComponents: [
        CheckinConfirmPopupComponent
    ],
    exports: [ConsumerCheckinComponent]
})
export class ConsumerCheckinModule { }
