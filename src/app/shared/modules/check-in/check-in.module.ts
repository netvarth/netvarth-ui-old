import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../common/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { CheckinAddMemberModule } from '../../../shared/modules/checkin-add-member/checkin-add-member.module';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { LoadingSpinnerModule } from '../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { CheckInComponent } from './check-in.component';
import { CheckInInnerComponent } from './check-in-inner/check-in-inner.component';
import { LivetrackComponent } from './live-track/livetrack.component';


@NgModule({
    imports: [
        CapitalizeFirstPipeModule,
        CommonModule,
        RouterModule,
        MaterialModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        FormsModule,
        CheckinAddMemberModule,
        LoadingSpinnerModule
    ],
    entryComponents: [
        CheckInComponent,
        LivetrackComponent
    ],
    declarations: [
        CheckInComponent,
        CheckInInnerComponent,
        LivetrackComponent
    ],
    exports: [CheckInInnerComponent]
})
export class CheckInModule {
}
