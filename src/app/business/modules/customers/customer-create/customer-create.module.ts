import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatOptionModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { QuestionnaireModule } from "../../../../shared/components/questionnaire/questionnaire.module";
import { FormMessageDisplayModule } from "../../../../shared/modules/form-message-display/form-message-display.module";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { CustomerCreateComponent } from "./customer-create.component";
import { RouterModule, Routes } from "@angular/router";
const routes: Routes = [
    {path:'', component: CustomerCreateComponent}
]
@NgModule({
    declarations: [CustomerCreateComponent],
    exports: [CustomerCreateComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatRadioModule,
        MatDatepickerModule,
        LoadingSpinnerModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        FormMessageDisplayModule,
        QuestionnaireModule,
        FormsModule,
        CapitalizeFirstPipeModule,
        [RouterModule.forChild(routes)]
    ]
})
export class CustomerCreateModule{}