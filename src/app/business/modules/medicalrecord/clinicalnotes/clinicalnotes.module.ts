import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule, Routes } from "@angular/router";
import { ClinicalnotesComponent } from "./clinicalnotes.component";
const routes: Routes = [
    { path: '', component: ClinicalnotesComponent }
];
@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [ClinicalnotesComponent],
    declarations: [ClinicalnotesComponent]
})
export class ClinicalnotesModule {}