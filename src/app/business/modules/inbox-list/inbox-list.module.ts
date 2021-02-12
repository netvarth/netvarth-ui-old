import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { LoadingSpinnerModule } from '../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { InboxRoutingModule } from './inbox-list-routing.module';
import { InboxListComponent } from './inbox-list.component';
@NgModule({
    imports: [
        CommonModule,
        InboxRoutingModule,
        LoadingSpinnerModule,
        FormsModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true })
    ],
    declarations: [
        InboxListComponent
    ],
    exports: [InboxListComponent]
})
export class InboxListModule {
}
