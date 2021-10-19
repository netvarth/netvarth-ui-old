import { NgModule } from '@angular/core';
import { FormMessageDisplayModule } from '../../../../../../shared/modules/form-message-display/form-message-display.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { CapitalizeFirstPipeModule } from '../../../../../../shared/pipes/capitalize.module';
import { CommonModule } from '@angular/common';
import { DisplayboardQSetComponent } from './displayboard-qset.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [
        DisplayboardQSetComponent
    ],
    imports: [
        FormMessageDisplayModule,
        FormsModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        CommonModule,
        NgxMatSelectSearchModule,
        DragDropModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule
    ],
    exports: [DisplayboardQSetComponent]
})
export class DisplayboardQSetModule { }
