import { NgModule } from '@angular/core';
import { NotificationsComponent } from './notifications.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
const routes: Routes = [
  { path: '', component: NotificationsComponent},
  { path: 'consumer', loadChildren: ()=> import('./consumer/consumer-notifications.module').then(m=>m.ConsumerNotificationsModule)},
  { path: 'provider', loadChildren: ()=> import('./provider/provider-notifications.module').then(m=>m.ProviderNotificationsModule)}
];
@NgModule({
    declarations: [
      NotificationsComponent
    ],
    imports: [
      CommonModule,
      MatSlideToggleModule,
      MatTooltipModule,
      FormsModule,
      CapitalizeFirstPipeModule,
      [RouterModule.forChild(routes)]
    ],
    exports: [NotificationsComponent]
})
export class NotificationsModule {}
