import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { QuestionnaireModule } from "../../../../shared/components/questionnaire/questionnaire.module";
import { ProviderWaitlistCheckInConsumerNoteModule } from "../../check-ins/provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.module";
import { CustomerActionsModule } from "../customer-actions/customer-actions.module";
import { CustomerDetailComponent } from "./customer-details.component";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { RouterModule, Routes } from "@angular/router";
import { RecordsDatagridModule } from "../../bookings/records-datagrid/records-datagrid.module";
import { ProviderServices } from "../../../../business/services/provider-services.service";
import { CommunicationPopupModule } from "../../bookings/communication-popup/communication-popup.module";
import { BookingMedicalRecordsRXModule } from "../../bookings/booking-medical-records-rx/booking-medical-records-rx.module";
import { BookingDocumentsModule } from "../../bookings/booking-documents/booking-documents.module";
import { VoiceConfirmModule } from "../video-confirm/voice-confirm.module";
// import { InboxListModule } from "../../bookings/inbox-list/inbox-list.module";
//import { BusinessInboxListModule } from "../../inbox-list/inbox-list.module";
const routes: Routes = [
    {path: '', component: CustomerDetailComponent}
]
@NgModule({
    declarations: [CustomerDetailComponent],
    exports: [CustomerDetailComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        ProviderWaitlistCheckInConsumerNoteModule,
        CustomerActionsModule,
        MatTooltipModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        QuestionnaireModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        RecordsDatagridModule,
        CommunicationPopupModule,
        BookingMedicalRecordsRXModule,
        BookingDocumentsModule,
        VoiceConfirmModule,
        // InboxListModule,
        //BusinessInboxListModule,
        [RouterModule.forChild(routes)]
    ],
    providers : [
        ProviderServices
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ]
})
export class CustomerDetailsModule {}
