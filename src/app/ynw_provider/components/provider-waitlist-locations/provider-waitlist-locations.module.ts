import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';
import { MaterialModule } from '../../../shared/modules/common/material.module';
import { ProviderWaitlistLocationsComponent } from './provider-waitlist-locations.component';
import { LoadingSpinnerModule } from '../loading-spinner/loading-spinner.module';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
@NgModule({
    imports: [
      CommonModule,
      LoadingSpinnerModule,
      BreadCrumbModule,
      MaterialModule,
      CapitalizeFirstPipeModule,
      FormMessageDisplayModule
    ],
    declarations: [ProviderWaitlistLocationsComponent],
    exports: [ProviderWaitlistLocationsComponent]
})

export class ProviderWaitlistLocationsModule {}
