import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './loading-spinner.component';
import { CommonLoadingSpinnerComponent } from '../../components/common-loading-spinner/common-loading-spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@NgModule({
    imports: [
        CommonModule,
        MatProgressSpinnerModule
    ],
    declarations: [
        LoadingSpinnerComponent,
        CommonLoadingSpinnerComponent],
    exports: [
        LoadingSpinnerComponent,
        CommonLoadingSpinnerComponent]
})

export class LoadingSpinnerModule { }
