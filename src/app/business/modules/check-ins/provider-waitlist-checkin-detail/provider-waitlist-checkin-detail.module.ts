import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTabsModule } from "@angular/material/tabs";
import { Nl2BrPipeModule } from "nl2br-pipe";
import { InboxListModule } from "../../../../shared/modules/inbox/inbox-list/inbox-list.module";
import { QuestionnaireModule } from "../../../../shared/components/questionnaire/questionnaire.module";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { ProviderWaitlistCheckInDetailComponent } from "./provider-waitlist-checkin-detail.component";
import { RouterModule, Routes } from "@angular/router";
import { CommunicationService } from "../../../../business/services/communication-service";
import { BookingHistoryModule } from "../../appointments/booking-history/booking-history.module";
import { CheckinsActionsModule } from "../checkin-actions/checkin-actions.module";
import { BookingMedicalRecordsRXModule } from "../../bookings/booking-medical-records-rx/booking-medical-records-rx.module";
import { RecordsDatagridModule } from "../../bookings/records-datagrid/records-datagrid.module";
import { NotesSectionModule } from "../../bookings/notes-section/notes-section.module";
import { HistorySectionModule } from "../../bookings/history-section/history-section.module";
const routes: Routes = [
    {path: '', component: ProviderWaitlistCheckInDetailComponent}
]
@NgModule({
    declarations: [ProviderWaitlistCheckInDetailComponent],
    exports: [ProviderWaitlistCheckInDetailComponent],
    imports: 
    [
        CommonModule,
        MatDialogModule,
        MatExpansionModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        MatTabsModule,
        QuestionnaireModule,
        Nl2BrPipeModule,
        BookingHistoryModule,
        InboxListModule,
        CheckinsActionsModule,
        BookingMedicalRecordsRXModule,
        RecordsDatagridModule,
        NotesSectionModule,
        HistorySectionModule,
        [RouterModule.forChild(routes)]
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ],
    providers: [
        CommunicationService,
    ]
})
export class ProviderWaitlistCheckInDetailModule{}
