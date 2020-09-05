import { VisualizeComponent } from './visualize.component';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../../shared/modules/common/material.module';

@NgModule({
    imports: [
        MaterialModule
    ],
    entryComponents: [VisualizeComponent],
    declarations: [VisualizeComponent],
    exports: [VisualizeComponent]
})

export class VisualizeModule { }
