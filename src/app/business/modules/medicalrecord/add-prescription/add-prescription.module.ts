import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { addPrescriptionComponent } from "./add-prescription.component";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import {  MatTableModule } from "@angular/material/table";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { ReactiveFormsModule } from "@angular/forms";


import { RouterModule, Routes } from "@angular/router";
const routes: Routes = [
    { path: '', component: addPrescriptionComponent}
]
@NgModule({
    imports: [
        CommonModule,
        LoadingSpinnerModule,
        MatTableModule,
        MatDialogModule,
        CapitalizeFirstPipeModule,
        ReactiveFormsModule,
        [RouterModule.forChild(routes)],
    ],
    exports: [addPrescriptionComponent],
    declarations: [addPrescriptionComponent],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ]
})
  export class addPrescriptionModule {}