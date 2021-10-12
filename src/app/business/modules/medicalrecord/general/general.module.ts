import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { GeneralComponent } from "./general.component";
const routes: Routes = [
    { path: '', component: GeneralComponent }
];
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CapitalizeFirstPipeModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [GeneralComponent],
    declarations: [GeneralComponent]
})
export class GeneralModule {}