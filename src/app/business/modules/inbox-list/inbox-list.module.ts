import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { LoadingSpinnerModule } from '../../../shared/modules/loading-spinner/loading-spinner.module';
import { BusinessInboxListComponent } from './inbox-list.component';
import { RouterModule, Routes } from '@angular/router';
import { InboxServices } from '../../../shared/modules/inbox/inbox.service';
const routes: Routes = [
    { path: '', component: BusinessInboxListComponent}
];
@NgModule({
    imports: [
        CommonModule,
        LoadingSpinnerModule,
        FormsModule,
        MatInputModule,
        CapitalizeFirstPipeModule,
        Nl2BrPipeModule,
        MatMenuModule,
        MatIconModule,
        [RouterModule.forChild(routes)],
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true })
    ],
    declarations: [
        BusinessInboxListComponent
    ],
    providers: [InboxServices],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ],
    exports: [BusinessInboxListComponent]
})
export class BusinessInboxListModule {
}
