import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { TelegramInfoComponent } from "./telegram-info.component";

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule
    ],
    exports: [TelegramInfoComponent],
    declarations:[TelegramInfoComponent]
})
export class TelegramInfoModule{}