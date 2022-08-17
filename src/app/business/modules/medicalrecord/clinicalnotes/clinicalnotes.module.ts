import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
// import { RouterModule, Routes } from "@angular/router";
// import { MedicalrecordService } from "../medicalrecord.service";
// import { MedicalrecordService } from "../medicalrecord.service";
import { ClinicalnotesComponent } from "./clinicalnotes.component";
import { ReactiveFormsModule } from "@angular/forms";
// const routes: Routes = [
//     { path: '', component: ClinicalnotesComponent }
// ];
@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        NgbModule,
        FormsModule,
        CapitalizeFirstPipeModule,
        ReactiveFormsModule
        // [RouterModule.forChild(routes)]
    ],
    exports: [ClinicalnotesComponent],
    declarations: [ClinicalnotesComponent]
    // providers: [
    //     MedicalrecordService
    // ]
})
export class ClinicalnotesModule { }