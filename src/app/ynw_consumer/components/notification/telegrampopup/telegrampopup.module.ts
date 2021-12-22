import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { TelegramPopupComponent } from "./telegrampopup.component";

@NgModule({
    declarations: [TelegramPopupComponent],
    exports: [TelegramPopupComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        ReactiveFormsModule,
        
    ]
})
export class TelegramPopupModule{}