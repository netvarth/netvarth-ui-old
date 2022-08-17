import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatOptionModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { LoadingSpinnerModule } from "../../modules/loading-spinner/loading-spinner.module";
import { CapitalizeFirstPipeModule } from "../../pipes/capitalize.module";
import { QnrDialogComponent } from "./qnr-dialog.component";

@NgModule({
    declarations: [QnrDialogComponent],
    exports: [QnrDialogComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        MatIconModule,
        MatRadioModule,
        MatDatepickerModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        MatOptionModule,
        MatSelectModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
    ]
})
export class QnrDialogModule{}