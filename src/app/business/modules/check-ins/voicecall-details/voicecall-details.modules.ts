import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/modules/common/shared.module';
import { LoadingSpinnerModule } from '../../../../shared/modules/loading-spinner/loading-spinner.module';
import { VoicecallDetailsComponent } from './voicecall-details.component';
@NgModule({
    imports: [
        SharedModule,
        LoadingSpinnerModule,
    ],
    declarations: [
        VoicecallDetailsComponent
    ],
    entryComponents: [
        VoicecallDetailsComponent
    ],
    exports: [VoicecallDetailsComponent]
})
export class VoicecallDetailsModule { }

