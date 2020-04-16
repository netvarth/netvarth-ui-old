import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsumerHomeComponent } from './components/home/consumer-home.component';
import { ConsumerComponent } from './consumer.component';
import { WaitlistComponent } from './components/waitlist/waitlist.component';
import { MembersComponent } from './components/members/members.component';
import { AuthGuardLogin } from '../shared/guard/auth.guard';
import { EditProfileComponent } from '../shared/modules/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from '../shared/modules/change-password/change-password.component';
import { ChangeMobileComponent } from '../shared/modules/change-mobile/change-mobile.component';
import { ChangeEmailComponent } from '../shared/modules/change-email/change-email.component';
import { checkindetailcomponent } from './components/home/checkindetail.component';
import { ConsumerAppointmentComponent } from './components/waitlist/appointment/consumer-appointment.component';
const routes: Routes = [
  {
    path: '', component: ConsumerComponent, children: [
      { path: '', component: ConsumerHomeComponent },
      { path: 'checkin', loadChildren: () => import('../ynw_consumer/components/waitlist/check-in/consumer-checkin.module').then(m => m.ConsumerCheckinModule) },
      { path: 'waitlist/:provider_id/:uuid', component: WaitlistComponent },
      { path: 'profile', component: EditProfileComponent, canActivate: [AuthGuardLogin] },
      { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuardLogin] },
      { path: 'change-mobile', component: ChangeMobileComponent, canActivate: [AuthGuardLogin] },
      { path: 'change-email', component: ChangeEmailComponent, canActivate: [AuthGuardLogin] },
      { path: 'members', component: MembersComponent, canActivate: [AuthGuardLogin] },
      { path: 'learn_more', loadChildren: () => import('./components/help/consumer-learnmore.module').then(m => m.ConsumerLearnmoreModule), canActivate: [AuthGuardLogin] },
      { path: 'faq', loadChildren: () => import('./components/consumer-faq/consumer-faq.module').then(m => m.ConsumerFaqModule), canActivate: [AuthGuardLogin] },
      {
        path: 'inbox',
        loadChildren: () => import('../shared/modules/inbox/inbox.module').then(m => m.InboxModule)
      },
      {
        path: 'checkindetails', component: checkindetailcomponent, canActivate: [AuthGuardLogin]
      },
      { path: 'appointment', component: ConsumerAppointmentComponent }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsumerRoutingModule {
}

