import { NgModule } from '@angular/core';
import { CheckinDetailsSendComponent } from './checkin-details-send.component';
import { SharedModule } from '../../../../shared/modules/common/shared.module';
import { LoadingSpinnerModule } from '../../../../shared/modules/loading-spinner/loading-spinner.module';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
@NgModule({
    imports: [
        SharedModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule
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
