import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CapitalizeFirstPipeModule } from '../../../../../../shared/pipes/capitalize.module';
import { LoadingSpinnerModule } from '../../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { CustomViewComponent } from './custom-view.component';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
    { path: '', component: CustomViewComponent}
];
@NgModule({
    imports: [
        ReactiveFormsModule,
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        NgxMatSelectSearchModule,
        MatButtonModule,
        LoadingSpinnerModule,
        FormsModule,
        CapitalizeFirstPipeModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        CustomViewComponent
    ],
    exports: [CustomViewComponent]
})
export class CustomviewModule { }
