import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { QuestionnaireModule } from "../../../../shared/components/questionnaire/questionnaire.module";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { ProviderWaitlistCheckInConsumerNoteModule } from "../../check-ins/provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.module";
import { DonationDetailsComponent } from "./donation-details.component";

@NgModule({
    declarations: [DonationDetailsComponent],
    exports: [DonationDetailsComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        ProviderWaitlistCheckInConsumerNoteModule,
        LoadingSpinnerModule,
        QuestionnaireModule,
        CapitalizeFirstPipeModule
    ]
})
export class DonationDetailsModule{}