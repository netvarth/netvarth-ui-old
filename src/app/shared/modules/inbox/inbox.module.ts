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
        InboxRoutingModule
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
