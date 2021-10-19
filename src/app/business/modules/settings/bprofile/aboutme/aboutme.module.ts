import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { RouterModule, Routes } from "@angular/router";
import { Nl2BrPipeModule } from "nl2br-pipe";
import { CapitalizeFirstPipeModule } from "../../../../../shared/pipes/capitalize.module";
import { FormMessageDisplayModule } from "../../../../../shared/modules/form-message-display/form-message-display.module";
import { ProPicPopupModule } from "../pro-pic-popup/pro-pic-popup.module";
import { AboutMeComponent } from "./aboutme.component";
const routes: Routes = [
    { path: '', component: AboutMeComponent }
]
@NgModule({
    declarations: [AboutMeComponent],
    exports: [AboutMeComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        ProPicPopupModule,
        FormMessageDisplayModule,
        Nl2BrPipeModule,
        Nl2BrPipeModule,
        CapitalizeFirstPipeModule,
        [RouterModule.forChild(routes)]
    ]
})
export class AboutMeModule {}