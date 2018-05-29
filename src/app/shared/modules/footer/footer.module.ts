import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../common/material.module';

import { FooterComponent } from './footer.component';
import { CommonLoadingSpinnerComponent } from '../../components/common-loading-spinner/common-loading-spinner.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule
    ],
    declarations: [FooterComponent,
        CommonLoadingSpinnerComponent],
    exports: [FooterComponent, CommonLoadingSpinnerComponent]
})
export class FooterModule {
}
