import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../common/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { BreadCrumbModule } from '../breadcrumb/breadcrumb.module';
import { CapitalizeFirstPipeModule } from '../../pipes/capitalize.module';
import { InboxListComponent } from './inbox-list/inbox-list.component';
import { InboxServices } from './inbox.service';
import { InboxRoutingModule } from './inbox-routing.module';
import { InboxOuterComponent } from './inbox-outer/inbox-outer.component';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { HeaderModule } from '../header/header.module';
import { LoadingSpinnerModule } from '../loading-spinner/loading-spinner.module';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { AddInboxMessagesModule } from '../../components/add-inbox-messages/add-inbox-messages.module';
@NgModule({
    imports: [
        CapitalizeFirstPipeModule,
        CommonModule,
        RouterModule,
        MaterialModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        FormsModule,
        BreadCrumbModule,
        InboxRoutingModule,
        Nl2BrPipeModule,
        HeaderModule,
        LoadingSpinnerModule,
        AddInboxMessagesModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true })
    ],
    entryComponents: [
      InboxListComponent
    ],
    declarations: [
      InboxListComponent,
      InboxOuterComponent
    ],
    exports: [InboxListComponent],
    providers: [
        InboxServices
    ]
})
export class InboxModule {
}
