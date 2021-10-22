import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoadingSpinnerModule } from "../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { HeaderModule } from "../../../../../shared/modules/header/header.module";
import { ConfirmPageComponent } from "./confirm-page.component";
import { MatTooltipModule } from "@angular/material/tooltip";
const routes: Routes = [
    { path: '', component: ConfirmPageComponent }
];
@NgModule({
    imports:[
        [RouterModule.forChild(routes)],
        HeaderModule,
        CommonModule,
        LoadingSpinnerModule,
        MatTooltipModule
    ],
    exports:[ConfirmPageComponent],
    declarations:[ConfirmPageComponent]
})
export class ConsumerCheckinConfirmModule{}