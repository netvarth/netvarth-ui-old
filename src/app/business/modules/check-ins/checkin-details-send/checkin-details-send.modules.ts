import { NgModule } from '@angular/core';
import { CheckinDetailsSendComponent } from './checkin-details-send.component';
import { SharedModule } from '../../../../shared/modules/common/shared.module';
import { LoadingSpinnerModule } from '../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
@NgModule({
    imports: [
        SharedModule,
        LoadingSpinnerModule,
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
