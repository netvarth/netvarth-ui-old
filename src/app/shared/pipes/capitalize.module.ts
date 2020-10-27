import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapitalizeFirstPipe } from '../pipes/capitalize.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [CapitalizeFirstPipe],
    exports: [CapitalizeFirstPipe]
})
export class CapitalizeFirstPipeModule {
}
