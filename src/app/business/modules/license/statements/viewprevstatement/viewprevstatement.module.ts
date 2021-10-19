import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CapitalizeFirstPipeModule } from "../../../../../shared/pipes/capitalize.module";
import { ViewPrevStatementComponent } from "./viewprevstatement.component";
const routes: Routes = [
    {path: '', component:ViewPrevStatementComponent }
]
@NgModule({
    declarations: [ViewPrevStatementComponent],
    exports: [ViewPrevStatementComponent],
    imports: [
        CommonModule,
        CapitalizeFirstPipeModule,
        [RouterModule.forChild(routes)]
    ]
})
export class ViewPrevStatementModule{}