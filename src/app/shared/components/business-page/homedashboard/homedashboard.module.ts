import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomedashboardComponent } from './homedashboard.component';
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { HeaderModule } from "../../../../shared/modules/header/header.module";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { RouterModule, Routes } from "@angular/router";
import { GalleryModule } from "../../../../shared/modules/gallery/gallery.module";
import { AddInboxMessagesModule } from "../../../../shared/components/add-inbox-messages/add-inbox-messages.module";
import { RateServiceModule } from "../../../../shared/components/consumer-rate-service-popup/rate-service-popup.module";
import { AttachmentPopupModule } from "../../../../shared/components/attachment-popup/attachment-popup.module";
import { CouponsModule } from "../../../../shared/components/coupons/coupons.module";
import {  TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { projectConstantsLocal } from "../../../../shared/constants/project-constants";
import { WLCardModule } from "../../../../ynw_consumer/components/home/wl-card/wl-card.module";
import { ApptCardModule } from "../../../../ynw_consumer/components/home/appt-card/appt-card.module";
import { MeetingDetailsModule } from "../../../../ynw_consumer/components/meeting-details/meeting-details.module";
import { ViewRxModule } from "../../../../ynw_consumer/components/home/view-rx/view-rx.module";
import { NotificationListBoxModule } from "../../../../ynw_consumer/shared/component/notification-list-box/notification-list-box.module";
import { ConsumerServices } from '../../../../ynw_consumer/services/consumer-services.service';
import { SharedServices } from '../../../../shared/services/shared-services';
export function homeHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, projectConstantsLocal.PATH+'assets/i18n/home/', '.json');
}
import { AuthGuardConsumer, AuthGuardLogin } from '../../../../shared/guard/auth.guard';

const routes: Routes = [
  { path: '', component: HomedashboardComponent },
// { path: '', component: HomedashboardComponent, children: [
    { path: 'checkin', loadChildren: () => import('../../../../ynw_consumer/components/waitlist/check-in/consumer-checkin.module').then(m => m.ConsumerCheckinModule) },
    { path: 'waitlist/:provider_id/:uuid', loadChildren: ()=> import('../../../../ynw_consumer/components/waitlist/waitlist.module').then(m=>m.WaitlistModule),
      canActivate: [AuthGuardConsumer] },
    { path: 'profile', loadChildren: ()=> import('../../../../shared/modules/edit-profile/edit-profile.module').then(m=>m.EditProfileModule), canActivate: [AuthGuardLogin] },
    { path: 'change-password', loadChildren: ()=>import('../../../../shared/modules/change-password/change-password.module').then(m=>m.ChangePasswordModule), canActivate: [AuthGuardLogin] },
    { path: 'change-mobile', loadChildren: ()=>import('../../../../shared/modules/change-mobile/change-mobile.module').then(m=>m.ChangeMobileModule), canActivate: [AuthGuardLogin] },
    { path: 'notification', loadChildren: ()=> import('../../../../ynw_consumer/components/notification/notification.module').then(m=>m.NotificationModule), canActivate: [AuthGuardLogin] },
    { path: 'members', loadChildren: ()=> import('../../../../ynw_consumer/components/members/members.module').then(m=>m.MembersModule), canActivate: [AuthGuardLogin] },
    { path: 'learn_more', loadChildren: () => import('../../../../ynw_consumer/components/help/consumer-learnmore.module').then(m => m.ConsumerLearnmoreModule), canActivate: [AuthGuardLogin] },
    { path: 'faq', loadChildren: () => import('../../../../ynw_consumer/components/consumer-faq/consumer-faq.module').then(m => m.ConsumerFaqModule), canActivate: [AuthGuardLogin] },
    { path: 'inbox', loadChildren: () => import('../../../../shared/modules/inbox/inbox-outer/inbox.module').then(m => m.InboxModule) },
    { path: 'checkindetails',loadChildren: ()=> import('../../../../ynw_consumer/components/home/checkin-details/checkin-detail.module').then(m=>m.CheckinDetailsModule), canActivate: [AuthGuardLogin] },
    { path: 'apptdetails', loadChildren: ()=> import('../../../../ynw_consumer/components/home/appt-details/appt-detail.module').then(m=>m.ApptDetailsModule), canActivate: [AuthGuardLogin] },
    { path: 'orderdetails', loadChildren: ()=> import('../../../../ynw_consumer/components/home/order-detail/order-detail.module').then(m=>m.OrderDetailModule), canActivate: [AuthGuardLogin] },
    { path: 'myfav', loadChildren: ()=> import('../../../../ynw_consumer/components/myfavourites/myfavourites.module').then(m=>m.MyFavouritesModule), canActivate: [AuthGuardLogin] },
    { path: 'appointment', loadChildren: () => import('../../../../ynw_consumer/components/waitlist/appointment/consumer-appointment.module').then(m => m.ConsumerAppointmentModule)},
    { path: 'donations', loadChildren: () => import('../../../../ynw_consumer/components/donations/donations.module').then(m => m.ConsumerDonationsModule) },
    { path: 'payments', loadChildren: () => import('../../../../ynw_consumer/components/payments/payments.module').then(m => m.ConsumerPaymentsModule), canActivate: [AuthGuardConsumer]  },
    { path: 'order', loadChildren: () => import('../../../../ynw_consumer/components/order/order.module').then(m => m.ConsumerOrderModule), canActivate: [AuthGuardConsumer]  },
    { path: 'questionnaire', loadChildren: () => import('../../../../shared/components/questionnaire/questionnaire.module').then(m => m.QuestionnaireModule) },
    { path: 'mywallet', loadChildren: () =>  import('../../../../ynw_consumer/modules/wallet/wallet.module').then(m => m.WalletModule), canActivate: [AuthGuardConsumer]  },
    { path: 'history', loadChildren:()=> import('../../../../ynw_consumer/components/history/history.module').then(m=>m.ConsumerHistoryModule), canActivate: [AuthGuardConsumer] },
  //]
//}
];


@NgModule({
  declarations: [
    HomedashboardComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
    LoadingSpinnerModule,
    CapitalizeFirstPipeModule,
    MatDialogModule,
    MatGridListModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    WLCardModule,
    ApptCardModule,
    GalleryModule,
    AddInboxMessagesModule,
    RateServiceModule,
    MeetingDetailsModule,
    ViewRxModule,
    NotificationListBoxModule,
    AttachmentPopupModule,
    CouponsModule,
    ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
    [RouterModule.forChild(routes)],
    HttpClientModule,
    TranslateModule.forChild({
      loader: {
          provide: TranslateLoader,
          useFactory: homeHttpLoaderFactory,
          deps: [HttpClient]
      },
  })
  ],
  exports:[HomedashboardComponent,RouterModule],
  providers:[ConsumerServices,SharedServices]
})
export class HomedashboardModule { }
