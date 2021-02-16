import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { LoadingSpinnerModule } from '../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { InboxRoutingModule } from './inbox-list-routing.module';
import { InboxListComponent } from './inbox-list.component';
@NgModule({
    imports: [
        CommonModule,
        InboxRoutingModule,
        LoadingSpinnerModule,
        FormsModule,
        MatInputModule,
        CapitalizeFirstPipeModule,
        Nl2BrPipeModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true })
    ],
    declarations: [
        InboxListComponent
    ],
    exports: [InboxListComponent]
})
export class InboxListModule {
}
