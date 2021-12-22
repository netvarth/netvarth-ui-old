import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatRadioModule } from "@angular/material/radio";
import { LoadingSpinnerModule } from "../../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { FormMessageDisplayModule } from "../../../../../../shared/modules/form-message-display/form-message-display.module";
import { DiscountDetailsComponent } from "./discountdetails.component";
import { RouterModule, Routes } from "@angular/router";
const routes: Routes = [
    { path: '', component: DiscountDetailsComponent }
]
@NgModule({
    declarations: [DiscountDetailsComponent],
    exports: [DiscountDetailsComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatButtonModule,
        FormMessageDisplayModule,
        LoadingSpinnerModule,
        [RouterModule.forChild(routes)]
    ]
})
export class DiscountDetailsModule{}