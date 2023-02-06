import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatRadioModule } from "@angular/material/radio";
import { FormMessageDisplayModule } from "../../../../shared/modules/form-message-display/form-message-display.module";
import { GoogleMapComponent } from "./googlemap.component";

@NgModule({
    declarations: [GoogleMapComponent],
    exports: [GoogleMapComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        MatExpansionModule,
        MatRadioModule,
        MatButtonModule,
        FormMessageDisplayModule
    ]
})
export class GooglemapModule {}