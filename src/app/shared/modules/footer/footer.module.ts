import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../common/material.module';

import { FooterComponent } from './footer.component';
import { LoadingSpinnerModule } from '../../../ynw_provider/components/loading-spinner/loading-spinner.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        LoadingSpinnerModule
    ],
    declarations: [FooterComponent],
    exports: [FooterComponent]
})
export class FooterModule {
}
