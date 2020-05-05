import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/modules/common/shared.module';
import { CallingModesComponent } from './calling-modes.component';

@NgModule({
    imports: [
        SharedModule
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
