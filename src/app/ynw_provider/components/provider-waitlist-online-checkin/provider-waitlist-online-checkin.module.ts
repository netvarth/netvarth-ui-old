import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProviderWaitlistOnlineCheckinComponent } from './provider-waitlist-online-checkin.component';
import { MaterialModule } from '../../../shared/modules/common/material.module';
import { FormsModule } from '@angular/forms';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
@NgModule({
    imports: [
      CommonModule,
      MaterialModule,
      FormsModule,
      CapitalizeFirstPipeModule,
      FormMessageDisplayModule
    ],
    declarations: [ProviderWaitlistOnlineCheckinComponent],
    exports: [ProviderWaitlistOnlineCheckinComponent]
})

export class ProviderWaitlistOnlineCheckinModule {}
