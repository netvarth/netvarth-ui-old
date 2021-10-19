import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProviderSchedulesComponent } from './add-provider-schedule.component';
import { FormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { LoadingSpinnerModule } from '../../../shared/modules/loading-spinner/loading-spinner.module';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      FormMessageDisplayModule,
      LoadingSpinnerModule,
      NgbTimepickerModule,
      MatIconModule,
      MatMenuModule,
      MatButtonModule,
      MatCheckboxModule,
    ],
    declarations: [AddProviderSchedulesComponent],
    exports: [AddProviderSchedulesComponent]
})

export class AddProviderSchedulesModule {}
