import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { ServiceSelectionRoutingModule } from './service-selection-routing.module';
import { ServiceSelectionComponent } from './service-selection.component';

@NgModule({
    imports: [
        MatTableModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        CommonModule,
        MatFormFieldModule,
        ServiceSelectionRoutingModule
    ],
    declarations: [
        ServiceSelectionComponent
    ],
    exports: [
        ServiceSelectionComponent
    ]
})
export class ServiceSelectionModule {}
