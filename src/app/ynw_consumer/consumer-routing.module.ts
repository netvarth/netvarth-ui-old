import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsumerComponent } from './consumer.component';
import { AuthGuardLogin } from '../shared/guard/auth.guard';
<<<<<<< HEAD
import { EditProfileComponent } from '../shared/modules/edit-profile/edit-profile.component';
import { CheckinDetailComponent } from './components/home/checkindetail.component';
import { ApptDetailComponent } from './components/home/appointmentdetail.component';
import { OrderDetailComponent } from './components/home/order-detail/order-detail.component';
=======
>>>>>>> refs/remotes/origin/jaldee-payment-profile-latest
const routes: Routes = [
  {
    path: '', component: ConsumerComponent, children: [
      { path: '', loadChildren: ()=> import('./components/home/consumer-home.module').then(m=>m.ConsumerHomeModule) },
      { path: 'checkin', loadChildren: () => import('../ynw_consumer/components/waitlist/check-in/consumer-checkin.module').then(m => m.ConsumerCheckinModule) },
<<<<<<< HEAD
      { path: 'waitlist/:provider_id/:uuid', component: WaitlistComponent },
      { path: 'profile', component: EditProfileComponent, canActivate: [AuthGuardLogin] },
      { path: 'members', component: MembersComponent, canActivate: [AuthGuardLogin] },
=======
      { path: 'waitlist/:provider_id/:uuid', loadChildren: ()=> import('../ynw_consumer/components/waitlist/waitlist.module').then(m=>m.WaitlistModule) },
      { path: 'profile', loadChildren: ()=> import('../shared/modules/edit-profile/edit-profile.module').then(m=>m.EditProfileModule), canActivate: [AuthGuardLogin] },
      { path: 'change-password', loadChildren: ()=>import('../shared/modules/change-password/change-password.module').then(m=>m.ChangePasswordModule), canActivate: [AuthGuardLogin] },
      { path: 'change-mobile', loadChildren: ()=>import('../shared/modules/change-mobile/change-mobile.module').then(m=>m.ChangeMobileModule), canActivate: [AuthGuardLogin] },
      { path: 'notification', loadChildren: ()=> import('../ynw_consumer/components/notification/notification.module').then(m=>m.NotificationModule), canActivate: [AuthGuardLogin] },
      { path: 'members', loadChildren: ()=> import('../ynw_consumer/components/members/members.module').then(m=>m.MembersModule), canActivate: [AuthGuardLogin] },
>>>>>>> refs/remotes/origin/jaldee-payment-profile-latest
      { path: 'learn_more', loadChildren: () => import('./components/help/consumer-learnmore.module').then(m => m.ConsumerLearnmoreModule), canActivate: [AuthGuardLogin] },
      { path: 'faq', loadChildren: () => import('./components/consumer-faq/consumer-faq.module').then(m => m.ConsumerFaqModule), canActivate: [AuthGuardLogin] },
<<<<<<< HEAD
      { path: 'inbox', loadChildren: () => import('../shared/modules/inbox/inbox.module').then(m => m.InboxModule) },
      { path: 'checkindetails', component: CheckinDetailComponent, canActivate: [AuthGuardLogin] },
      { path: 'apptdetails', component: ApptDetailComponent, canActivate: [AuthGuardLogin] },
      { path: 'orderdetails', component: OrderDetailComponent, canActivate: [AuthGuardLogin] },
=======
      { path: 'inbox', loadChildren: () => import('../shared/modules/inbox/inbox-outer/inbox.module').then(m => m.InboxModule) },
      { path: 'checkindetails',loadChildren: ()=> import('../ynw_consumer/components/home/checkin-details/checkin-detail.module').then(m=>m.CheckinDetailsModule), canActivate: [AuthGuardLogin] },
      { path: 'apptdetails', loadChildren: ()=> import('../ynw_consumer/components/home/appt-details/appt-detail.module').then(m=>m.ApptDetailsModule), canActivate: [AuthGuardLogin] },
      { path: 'orderdetails', loadChildren: ()=> import('../ynw_consumer/components/home/order-detail/order-detail.module').then(m=>m.OrderDetailModule), canActivate: [AuthGuardLogin] },
      { path: 'myfav', loadChildren: ()=> import('./components/myfavourites/myfavourites.module').then(m=>m.MyFavouritesModule), canActivate: [AuthGuardLogin] },
>>>>>>> refs/remotes/origin/jaldee-payment-profile-latest
      { path: 'appointment', loadChildren: () => import('../ynw_consumer/components/waitlist/appointment/consumer-appointment.module').then(m => m.ConsumerAppointmentModule) },
      { path: 'donations', loadChildren: () => import('./components/donations/donations.module').then(m => m.ConsumerDonationsModule) },
      { path: 'payments', loadChildren: () => import('../ynw_consumer/components/payments/payments.module').then(m => m.ConsumerPaymentsModule) },
      { path: 'order', loadChildren: () => import('../ynw_consumer/components/order/order.module').then(m => m.ConsumerOrderModule) },
      { path: 'questionnaire', loadChildren: () => import('../shared/components/questionnaire/questionnaire.module').then(m => m.QuestionnaireModule) },
<<<<<<< HEAD
=======
      { path: 'mywallet', loadChildren: () =>  import('../ynw_consumer/modules/wallet/wallet.module').then(m => m.WalletModule) },
      { path: 'history', loadChildren:()=> import('../ynw_consumer/components/history/history.module').then(m=>m.ConsumerHistoryModule) },
>>>>>>> refs/remotes/origin/jaldee-payment-profile-latest
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsumerRoutingModule {
}

