import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunicationPopupComponent } from './communication-popup.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoadingSpinnerModule } from '../../../../shared/modules/loading-spinner/loading-spinner.module';

@NgModule({
  declarations: [CommunicationPopupComponent],
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    CapitalizeFirstPipeModule,
    MatTooltipModule,
    LoadingSpinnerModule
  ],
  exports: [CommunicationPopupComponent]
})
export class CommunicationPopupModule {
}
