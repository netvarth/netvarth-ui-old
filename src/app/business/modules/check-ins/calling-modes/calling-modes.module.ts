import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/modules/common/shared.module';
import { CallingModesComponent } from './calling-modes.component';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { CallingModesRoutingModule } from './calling-modes.routing.module';

@NgModule({
    imports: [
        SharedModule,
        CapitalizeFirstPipeModule,
        CallingModesRoutingModule
    ],
    declarations: [
        CallingModesComponent
    ],
    entryComponents: [
        CallingModesComponent
    ],
    exports: [CallingModesComponent]
})
export class CallingModesModule { }
