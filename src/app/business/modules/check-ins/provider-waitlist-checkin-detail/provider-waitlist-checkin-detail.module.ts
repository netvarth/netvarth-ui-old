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
        [RouterModule.forChild(routes)]
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ],
    providers: [
        CommunicationService
    ]
})
export class ProviderWaitlistCheckInDetailModule{}
