import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule, Routes } from "@angular/router";
import { JaldeeVideoSettingsComponent } from "./jaldee-video-settings.component";
const routes: Routes = [
    { path: '', component: JaldeeVideoSettingsComponent }
];
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatTooltipModule,
        MatSlideToggleModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [JaldeeVideoSettingsComponent],
    declarations: [JaldeeVideoSettingsComponent]
})
export class JaldeeVideoSettingsModule {}