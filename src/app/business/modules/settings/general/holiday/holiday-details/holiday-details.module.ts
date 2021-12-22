import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { RouterModule, Routes } from "@angular/router";
import { NgbTimepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { FormMessageDisplayModule } from "../../../../../../shared/modules/form-message-display/form-message-display.module";
import { LoadingSpinnerModule } from "../../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { HolidayDetailsComponent } from "./holiday-details.component";
const routes: Routes = [
    { path: '',  component: HolidayDetailsComponent }
];
@NgModule({
    imports: [
        LoadingSpinnerModule,
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatDialogModule,
        MatMenuModule,
        MatButtonModule,
        MatInputModule,
        MatDatepickerModule,
        MatIconModule,
        NgbTimepickerModule,
        FormMessageDisplayModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [HolidayDetailsComponent],
    declarations: [HolidayDetailsComponent]
})
export class HolidayDetailsBoxModule {}