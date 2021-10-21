import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule, Routes } from '@angular/router';
import { CapitalizeFirstPipeModule } from '../../../../../../shared/pipes/capitalize.module';
import { LabelDetailsComponent } from './label-details.component';
const routes: Routes = [
    {path: '', component: LabelDetailsComponent}
]
@NgModule({
    imports: [
        CommonModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        FormsModule,
        CapitalizeFirstPipeModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        LabelDetailsComponent
    ],
    exports: [LabelDetailsComponent]
})
export class LabelDetailSModule{ }
