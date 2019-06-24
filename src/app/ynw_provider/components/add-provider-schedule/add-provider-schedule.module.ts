import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProviderSchedulesComponent } from './add-provider-schedule.component';
import { MaterialModule } from '../../../shared/modules/common/material.module';
import { FormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { LoadingSpinnerModule } from '../../components/loading-spinner/loading-spinner.module';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
    imports: [
      CommonModule,
      MaterialModule,
      FormsModule,
      FormMessageDisplayModule,
      LoadingSpinnerModule,
      NgbTimepickerModule
    ],
    declarations: [AddProviderSchedulesComponent],
    exports: [AddProviderSchedulesComponent]
})

export class AddProviderSchedulesModule {}
