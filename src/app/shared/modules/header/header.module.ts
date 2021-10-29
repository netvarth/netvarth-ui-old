import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CapitalizeFirstPipeModule } from '../../pipes/capitalize.module';
import { HeaderComponent } from './header.component';
import { LoadingSpinnerModule } from '../loading-spinner/loading-spinner.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    imports: [
        CapitalizeFirstPipeModule,
        CommonModule,
        RouterModule,
        LoadingSpinnerModule,
        MatDialogModule,
        ScrollToModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule
    ],
    declarations: [HeaderComponent],
    exports: [HeaderComponent]
})
export class HeaderModule {
}
