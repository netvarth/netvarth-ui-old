import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { GalleryModule } from '../../../../shared/modules/gallery/gallery.module';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { LoadingSpinnerModule } from '../../../../shared/modules/loading-spinner/loading-spinner.module';
import { HistorySectionComponent } from './history-section.component';

@NgModule({
  declarations: [HistorySectionComponent],
  imports: [
    CommonModule,
    MatGridListModule,
    CapitalizeFirstPipeModule,
    GalleryModule,
    ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
    LoadingSpinnerModule
  ],
  exports: [HistorySectionComponent]
})
export class HistorySectionModule {
}
