import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { StatementsComponent } from "./statements.component";
import { RouterModule, Routes } from "@angular/router";
const routes: Routes = [
    {path: '', component: StatementsComponent}
]
@NgModule({
    declarations: [StatementsComponent],
    exports: [StatementsComponent],
    imports: [
        CommonModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        [RouterModule.forChild(routes)]
    ]
})
export class StatementsModule{}