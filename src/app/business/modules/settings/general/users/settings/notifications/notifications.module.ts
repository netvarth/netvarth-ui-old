import { NgModule } from '@angular/core';
import { BreadCrumbModule } from '../../../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { MaterialModule } from '../../../../../../../shared/modules/common/material.module';
import { FormMessageDisplayModule } from '../../../../../../../shared/modules/form-message-display/form-message-display.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { CapitalizeFirstPipeModule } from '../../../../../../../shared/pipes/capitalize.module';
import { CommonModule } from '@angular/common';
import { NotificationsUserComponent } from './notifications.component';
import { NotificationsRoutingUserModule } from './notifications.routing.module';
import { ConsumerNotificationUserComponent } from './consumer/consumer-notifications.component';
import { ProviderNotificationUserComponent } from './provider/provider-notifications.component';

@NgModule({
    declarations: [
      NotificationsUserComponent,
      ProviderNotificationUserComponent,
      ConsumerNotificationUserComponent
    ],
    imports: [
      NotificationsRoutingUserModule,
        BreadCrumbModule,
        MaterialModule,
        FormMessageDisplayModule,
        FormsModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        CommonModule
    ],
    exports: [NotificationsUserComponent]
})
export class NotificationUserModule {}
