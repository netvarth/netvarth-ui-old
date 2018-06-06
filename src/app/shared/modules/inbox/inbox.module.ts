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
        InboxComponent
    ],
    declarations: [
        InboxComponent
    ],
    exports: [InboxComponent],
    providers: [
        InboxServices
    ]
})
export class InboxModule {
}
