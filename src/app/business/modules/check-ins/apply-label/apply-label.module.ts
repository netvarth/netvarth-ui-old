import { NgModule } from '@angular/core';
import { ApplyLabelComponent } from './apply-label.component';
import { SharedModule } from '../../../../shared/modules/common/shared.module';

@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        ApplyLabelComponent
    ],
    entryComponents: [
        ApplyLabelComponent
    ],
    exports: [ApplyLabelComponent]
})
export class ApplyLabelModule { }
