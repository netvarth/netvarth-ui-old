import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../common/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { BreadCrumbModule } from '../breadcrumb/breadcrumb.module';
import { InboxComponent } from './inbox.component';
import { InboxServices } from './inbox.service';
import { InboxRoutingModule } from './inbox-routing.module';

 import { InboxMessageComponent } from '../../components/inbox-message/inbox-message.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        FormsModule,
        BreadCrumbModule,
        InboxRoutingModule
    ],
    entryComponents: [
        InboxComponent,
        InboxMessageComponent
    ],
    declarations: [
        InboxComponent,
        InboxMessageComponent
    ],
    exports: [InboxComponent],
    providers: [
        InboxServices
    ]
})
export class InboxModule {
}
