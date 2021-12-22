import { NgModule } from '@angular/core';
import { LoadingSpinnerModule } from '../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
import { CommonModule } from '@angular/common';
import { LabelsComponent } from './labels.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
    { path: '',  component: LabelsComponent},
    { path: ':id', loadChildren: ()=> import('./detail/label-details.module').then(m=>m.LabelDetailSModule)}
];
@NgModule({
    declarations: [
       LabelsComponent
    ],
    imports: [
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        CommonModule,
        MatTooltipModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [LabelsComponent]
})
export class LabelsModule {}
