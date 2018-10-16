import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapitalizeFirstPipe } from '../pipes/capitalize.pipe';

// import { MatMenuModule } from '@angular/material/menu';
// import { MatIconModule } from '@angular/material/icon';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [CapitalizeFirstPipe],
    exports: [CapitalizeFirstPipe]
})
export class CapitalizeFirstPipeModule {
}
