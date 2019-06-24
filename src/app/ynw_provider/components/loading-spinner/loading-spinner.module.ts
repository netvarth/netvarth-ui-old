import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './loading-spinner.component';
import { MaterialModule } from '../../../shared/modules/common/material.module';
import { CommonLoadingSpinnerComponent } from '../../../shared/components/common-loading-spinner/common-loading-spinner.component';
@NgModule({
    imports: [
        CommonModule,
        MaterialModule
    ],
    declarations: [
        LoadingSpinnerComponent,
        CommonLoadingSpinnerComponent],
    exports: [
        LoadingSpinnerComponent,
        CommonLoadingSpinnerComponent]
})

export class LoadingSpinnerModule { }
