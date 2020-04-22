import { NgModule } from '@angular/core';
import { ApplyLabelComponent } from './apply-label.component';
import { MaterialModule } from '../../../../shared/modules/common/material.module';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';
import { SharedModule } from '../../../../shared/modules/common/shared.module';

@NgModule({
    imports: [
        SharedModule,
        MaterialModule,
        FormMessageDisplayModule
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
