import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatOptionModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { CapitalizeFirstPipeModule } from "../../../../../../shared/pipes/capitalize.module";
import { FormMessageDisplayModule } from "../../../../../../shared/modules/form-message-display/form-message-display.module";
import { LoadingSpinnerModule } from "../../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { UserConfirmBoxModule } from "../confirm-box/user-confirm-box.module";
import { BranchUserDetailComponent } from "./user-detail.component";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule, Routes } from "@angular/router";
const routes: Routes = [
    {path:'', component: BranchUserDetailComponent}
]
@NgModule({
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatRadioModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatButtonModule,
        ReactiveFormsModule,
        UserConfirmBoxModule,
        LoadingSpinnerModule,
        FormMessageDisplayModule,
        CapitalizeFirstPipeModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [BranchUserDetailComponent],
    declarations: [BranchUserDetailComponent]
})
export class BranchUserDetailModule {}