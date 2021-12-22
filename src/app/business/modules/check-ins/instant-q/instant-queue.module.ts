import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { NgbTimepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { FormMessageDisplayModule } from "../../../../shared/modules/form-message-display/form-message-display.module";
import { InstantQueueComponent } from "./instant-queue.component";
import { MatDialogModule } from "@angular/material/dialog";

@NgModule({
    declarations: [InstantQueueComponent],
    exports: [InstantQueueComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        NgbTimepickerModule,
        LoadingSpinnerModule,
        MatDialogModule
    ]
})
export class InstantQueueModule{}
