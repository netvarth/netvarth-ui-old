import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { NgbTimepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { FormMessageDisplayModule } from "../../../../../../shared/modules/form-message-display/form-message-display.module";
import { TimewindowPopupComponent } from "./timewindowpopup.component";

@NgModule({
    declarations: [TimewindowPopupComponent],
    exports: [TimewindowPopupComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        FormMessageDisplayModule,
        NgbTimepickerModule
    ]
})
export class TimewindowPopupModule{}