import { NgModule } from '@angular/core';
import { CheckinDetailsSendComponent } from './checkin-details-send.component';
import { LoadingSpinnerModule } from '../../../../shared/modules/loading-spinner/loading-spinner.module';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';
import { MatButtonModule } from '@angular/material/button';
import { AddProviderAddonsModule } from '../../add-provider-addons/add-provider-addons.module';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatCheckboxModule,
        MatButtonModule,
        LoadingSpinnerModule,
        FormMessageDisplayModule,
        CapitalizeFirstPipeModule,
        AddProviderAddonsModule
    ],
    declarations: [
        CheckinDetailsSendComponent
    ],
    exports: [CheckinDetailsSendComponent]
})
export class CheckinDetailsSendModule { }
