import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatChipsModule } from "@angular/material/chips";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { SlotPickerComponent } from "./slot-picker.component";

@NgModule({
    imports: [
        CommonModule,
        MatDatepickerModule,
        MatChipsModule,
        FormsModule
    ],
    exports: [SlotPickerComponent],
    declarations: [
        SlotPickerComponent
    ]
})
export class SlotPickerModule {}