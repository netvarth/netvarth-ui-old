import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { FormMessageDisplayModule } from "../../../../../shared/modules/form-message-display/form-message-display.module";
import { MrfileuploadpopupComponent } from "./mrfileuploadpopup.component";

@NgModule({
    declarations: [
        MrfileuploadpopupComponent
    ],
    imports: [
        MatDialogModule,
        CommonModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        FormMessageDisplayModule
    ],
    exports: [MrfileuploadpopupComponent]
})
export class MrfileuploadpopupModule {}