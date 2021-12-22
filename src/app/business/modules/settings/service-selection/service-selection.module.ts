import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { RouterModule, Routes } from '@angular/router';
import { ServiceSelectionComponent } from './service-selection.component';
const routes: Routes = [
    { path: '', component: ServiceSelectionComponent }
];
@NgModule({
    imports: [
        MatTableModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        CommonModule,
        MatFormFieldModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        ServiceSelectionComponent
    ],
    exports: [
        ServiceSelectionComponent
    ]
})
export class ServiceSelectionModule {}
