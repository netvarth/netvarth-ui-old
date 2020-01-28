import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../common/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { CheckinAddMemberModule } from '../../../shared/modules/checkin-add-member/checkin-add-member.module';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { LoadingSpinnerModule } from '../loading-spinner/loading-spinner.module';
import { CheckInComponent } from './check-in.component';
import { CheckInInnerComponent } from './check-in-inner/check-in-inner.component';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';


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
        LoadingSpinnerModule,
        NgbTimepickerModule
    ],
    entryComponents: [
        CheckInComponent
    ],
    declarations: [
        CheckInComponent,
        CheckInInnerComponent
    ],
    exports: [CheckInInnerComponent]
})
export class CheckInModule {
}
