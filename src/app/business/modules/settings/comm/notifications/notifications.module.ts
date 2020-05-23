import { NgModule } from '@angular/core';
import { BreadCrumbModule } from '../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { MaterialModule } from '../../../../../shared/modules/common/material.module';
import { FormMessageDisplayModule } from '../../../../../shared/modules/form-message-display/form-message-display.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import { NotificationsRoutingModule } from './notifications.routing.module';
import { ConsumerNotificationsComponent } from './consumer/consumer-notifications.component';
import { ProviderNotificationsComponent } from './provider/provider-notifications.component';

@NgModule({
    declarations: [
      NotificationsComponent,
      ProviderNotificationsComponent,
      ConsumerNotificationsComponent
    ],
    imports: [
        NotificationsRoutingModule,
        BreadCrumbModule,
        MaterialModule,
        FormMessageDisplayModule,
        FormsModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        CommonModule
    ],
    exports: [NotificationsComponent]
})
export class NotificationsModule {}
