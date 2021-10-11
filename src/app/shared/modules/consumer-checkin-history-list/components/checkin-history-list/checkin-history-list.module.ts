import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { CapitalizeFirstPipeModule } from "../../../../../shared/pipes/capitalize.module";
import { AddInboxMessagesModule } from "../../../../../shared/components/add-inbox-messages/add-inbox-messages.module";
import { RateServiceModule } from "../../../../../shared/components/consumer-rate-service-popup/rate-service-popup.module";
import { PagerModule } from "../../../pager/pager.module";
import { CheckinPaymentModule } from "../checkin-payment/checkin-payment.module";
import { ConsumerCheckInHistoryListComponent } from "./checkin-history-list.component";
import { CheckInHistoryServices } from "./checkin-history-list.service";

@NgModule({
    imports: [
        CommonModule,
        PagerModule,
        MatDialogModule,
        RateServiceModule,
        CheckinPaymentModule,
        AddInboxMessagesModule,
        CapitalizeFirstPipeModule
    ],
    exports: [ConsumerCheckInHistoryListComponent],
    declarations: [
        ConsumerCheckInHistoryListComponent
    ],
    providers: [
        CheckInHistoryServices
      ]
})
export class CheckinHistoryListModule {}