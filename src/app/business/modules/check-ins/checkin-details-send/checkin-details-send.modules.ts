import { NgModule } from '@angular/core';
import { CheckinDetailsSendComponent } from './checkin-details-send.component';
import { SharedModule } from '../../../../shared/modules/common/shared.module';
@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        CheckinDetailsSendComponent
    ],
    entryComponents: [
        CheckinDetailsSendComponent
    ],
    exports: [CheckinDetailsSendComponent]
})
export class CheckinDetailsSendModule { }
