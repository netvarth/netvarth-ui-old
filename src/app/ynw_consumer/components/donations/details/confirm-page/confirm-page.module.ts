import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LoadingSpinnerModule } from "../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { HeaderModule } from "../../../../../shared/modules/header/header.module";
import { ConfirmPageComponent } from "./confirm-page.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule, Routes } from "@angular/router";
const routes: Routes = [
    {path: '', component: ConfirmPageComponent}
]
@NgModule({
    declarations: [ConfirmPageComponent],
    exports: [ConfirmPageComponent],
    imports: [
        CommonModule,
        HeaderModule,
        LoadingSpinnerModule,
        MatTooltipModule,
        [RouterModule.forChild(routes)]
    ]
})
export class ConfirmPageModule{}