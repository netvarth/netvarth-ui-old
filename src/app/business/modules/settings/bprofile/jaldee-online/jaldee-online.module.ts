import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule, Routes } from "@angular/router";
import { FormMessageDisplayModule } from "../../../../../shared/modules/form-message-display/form-message-display.module";
import { QRCodeGeneratorModule } from "../qrcodegenerator/qrcodegenerator.module";
import { JaldeeOnlineComponent } from "./jaldee-online.component";
const routes: Routes = [
    { path: '', component: JaldeeOnlineComponent }
]
@NgModule({
    declarations: [JaldeeOnlineComponent],
    exports: [JaldeeOnlineComponent],
    imports: [
        CommonModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        FormMessageDisplayModule,
        QRCodeGeneratorModule,
        ReactiveFormsModule,
        [RouterModule.forChild(routes)]
    ]
})
export class JaldeeOnlineModule {}