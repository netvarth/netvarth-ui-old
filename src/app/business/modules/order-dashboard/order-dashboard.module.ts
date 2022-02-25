import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderDashboardComponent } from './order-dashboard.component';
import { MatTabsModule } from '@angular/material/tabs';
import {MatBadgeModule} from '@angular/material/badge';
import { LoadingSpinnerModule } from '../../../shared/modules/loading-spinner/loading-spinner.module';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { CardModule } from '../../../shared/components/card/card.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DisplaylabelpopupModule } from './displaylabel/displaylabel.module';
import { RouterModule, Routes } from '@angular/router';
import { OrderActionsModule } from './order-actions/order-actions.module';
const routes: Routes = [
  { path: '', component: OrderDashboardComponent },
  { path: 'edit/:id', loadChildren: ()=> import('./order-edit/order-edit.module').then(m=>m.OrderEditModule)},
  { path: 'questionnaires', loadChildren: () => import('../questionnaire-list-popup/questionnaire-list-popup.module').then(m => m.QuestionnaireListPopupModule) },
  { path: 'order-wizard', loadChildren: ()=> import('./order-wizard/order-wizard.module').then(m=>m.OrderWizardModule)},
  { path: ':id', loadChildren: ()=> import('./order-details/order-details.module').then(m=>m.OrderDetailsModule)},
  
  { path: ':id/print', loadChildren: ()=> import('../../shared/print-booking-details/print-booking-detail.module').then(m=>m.PrintBookingDetailModule)} 
];
@NgModule({
  declarations: [
    OrderDashboardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatTabsModule,
    MatBadgeModule,
    LoadingSpinnerModule,
    CapitalizeFirstPipeModule,
    CardModule,
    Nl2BrPipeModule,
    ModalGalleryModule,
    MatDialogModule,
    MatChipsModule,
    MatDatepickerModule,
    DisplaylabelpopupModule,
    OrderActionsModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    OrderDashboardComponent
  ]
})
export class OrderDashboardModule { }
