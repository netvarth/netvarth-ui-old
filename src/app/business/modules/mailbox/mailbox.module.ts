import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../shared/modules/common/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';
import { MailboxRoutingModule } from './mailbox.routing.module';
import { MailboxComponent } from './mailbox.component';
import { InboxServices } from '../../../shared/modules/inbox/inbox.service';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { LoadingSpinnerModule } from '../../../ynw_provider/components/loading-spinner/loading-spinner.module';

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
        MailboxRoutingModule,
        Nl2BrPipeModule,
        SharedModule,
        LoadingSpinnerModule
    ],
    exports: [MailboxComponent],
    entryComponents: [],
    declarations: [MailboxComponent],
    providers: [
        InboxServices
    ]
})

export class MailboxModule {

}
