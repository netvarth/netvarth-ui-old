import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CapitalizeFirstPipeModule } from '../../pipes/capitalize.module';
import { FooterComponent } from './footer.component';
import { LoadingSpinnerModule } from '../loading-spinner/loading-spinner.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        MatTooltipModule,
        MatSlideToggleModule
    ],
    declarations: [FooterComponent],
    exports: [FooterComponent]
})
export class FooterModule {
}
