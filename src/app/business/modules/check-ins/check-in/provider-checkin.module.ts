import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatOptionModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { RouterModule, Routes } from "@angular/router";
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { OwlModule } from "ngx-owl-carousel";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { QuestionnaireModule } from "../../../../shared/components/questionnaire/questionnaire.module";
import { CheckinAddMemberModule } from "../../../../shared/modules/checkin-add-member/checkin-add-member.module";
import { FormMessageDisplayModule } from "../../../../shared/modules/form-message-display/form-message-display.module";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { ProviderCheckinComponent } from "./provider-checkin.component";
const routes: Routes = [
    {path: '', component: ProviderCheckinComponent}
]
@NgModule({
    declarations: [ProviderCheckinComponent],
    exports: [ProviderCheckinComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        NgxIntlTelInputModule,
        FormMessageDisplayModule,
        CheckinAddMemberModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatDatepickerModule,
        MatChipsModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        MatCheckboxModule,
        MatRadioModule,
        OwlModule,
        QuestionnaireModule,
        CapitalizeFirstPipeModule,
        [RouterModule.forChild(routes)]
    ]
})
export class ProviderCheckinModule{}
