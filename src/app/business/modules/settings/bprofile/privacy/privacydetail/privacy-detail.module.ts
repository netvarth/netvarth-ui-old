import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { RouterModule, Routes } from "@angular/router";
import { FormMessageDisplayModule } from "../../../../../../shared/modules/form-message-display/form-message-display.module";
import { LoadingSpinnerModule } from "../../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { PrivacyDetailComponent } from "./privacy-detail.component";
const routes: Routes = [
    { path: '', component: PrivacyDetailComponent }
];
@NgModule({
    declarations: [PrivacyDetailComponent],
    exports: [PrivacyDetailComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        FormMessageDisplayModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatRadioModule,
        MatButtonModule,
        [RouterModule.forChild(routes)]
    ]
})
export class PrivacyDetailModule {}