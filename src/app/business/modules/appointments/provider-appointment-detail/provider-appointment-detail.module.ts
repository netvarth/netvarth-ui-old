import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTabsModule } from "@angular/material/tabs";
import { RouterModule, Routes } from "@angular/router";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { QuestionnaireModule } from "../../../../shared/components/questionnaire/questionnaire.module";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { AddProviderWaitlistCheckInProviderNoteModule } from "../../check-ins/add-provider-waitlist-checkin-provider-note/add-provider-waitlist-checkin-provider-note.module";
import { ProviderAppointmentDetailComponent } from "./provider-appointment-detail.component";
import { Nl2BrPipeModule } from "nl2br-pipe";
import { InboxListModule } from "../../../../shared/modules/inbox/inbox-list/inbox-list.module";
import { CommunicationService } from "../../../../business/services/communication-service";
const routes: Routes= [
    { path: '', component: ProviderAppointmentDetailComponent }
]
@NgModule({
    declarations: [ProviderAppointmentDetailComponent],
    exports: [ProviderAppointmentDetailComponent],
    imports: [
        CommonModule,
        AddProviderWaitlistCheckInProviderNoteModule,
        CapitalizeFirstPipeModule,
        QuestionnaireModule,
        MatExpansionModule,
        MatTabsModule,
        LoadingSpinnerModule,
        Nl2BrPipeModule,
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
export class ProviderAppointmentDetailModule{}