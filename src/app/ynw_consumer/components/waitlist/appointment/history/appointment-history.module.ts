import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { RouterModule, Routes } from "@angular/router";
import { AddInboxMessagesModule } from "../../../../../shared/components/add-inbox-messages/add-inbox-messages.module";
import { CheckinPaymentModule } from "../../../../../shared/modules/consumer-checkin-history-list/components/checkin-payment/checkin-payment.module";
import { HeaderModule } from "../../../../../shared/modules/header/header.module";
import { LoadingSpinnerModule } from "../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { CapitalizeFirstPipeModule } from "../../../../../shared/pipes/capitalize.module";
import { ConsumerAppointmentHistoryComponent } from "./appointment-history.component";
const routes: Routes = [
    { path: '', component: ConsumerAppointmentHistoryComponent }
];
@NgModule({
    imports:[
        CapitalizeFirstPipeModule,
        MatIconModule,
        MatMenuModule,
        CommonModule,
        LoadingSpinnerModule,
        HeaderModule,
        CheckinPaymentModule,
        AddInboxMessagesModule,
        [RouterModule.forChild(routes)]
    ],
    exports:[
        ConsumerAppointmentHistoryComponent
    ],
    declarations:[
        ConsumerAppointmentHistoryComponent
    ]
})
export class AppointmentHistoryModule{}