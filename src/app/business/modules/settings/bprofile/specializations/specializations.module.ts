import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { RouterModule, Routes } from "@angular/router";
import { SpecializationsComponent } from "./specializations.component";
const routes: Routes = [
    { path: '', component: SpecializationsComponent }
]
@NgModule({
    declarations: [SpecializationsComponent],
    exports: [SpecializationsComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatCheckboxModule,
        [RouterModule.forChild(routes)]
    ]
})
export class SpecializationsModule {}