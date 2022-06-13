import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
// import { RouterModule, Routes } from "@angular/router";
// import { MedicalrecordService } from "../medicalrecord.service";
// import { MedicalrecordService } from "../medicalrecord.service";
import { ClinicalnotesComponent } from "./clinicalnotes.component";
// const routes: Routes = [
//     { path: '', component: ClinicalnotesComponent }
// ];
@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        NgbModule
        // [RouterModule.forChild(routes)]
    ],
    exports: [ClinicalnotesComponent],
    declarations: [ClinicalnotesComponent]
    // providers: [
    //     MedicalrecordService
    // ]
})
export class ClinicalnotesModule { }