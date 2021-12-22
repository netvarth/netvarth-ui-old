import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MaintenanceMsgComponent } from "./maintenance-msg.component";

@NgModule({
    declarations: [MaintenanceMsgComponent],
    exports: [MaintenanceMsgComponent],
    imports: [
        CommonModule,
        MatDialogModule
    ]
})
export class MaintenanceMsgModule{}