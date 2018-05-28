import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ConsumerHomeComponent} from './components/home/consumer-home.component';
import {ConsumerComponent} from './consumer.component';
import {WaitlistComponent} from './components/waitlist/waitlist.component';
import {MembersComponent } from './components/members/members.component';

import { AuthGuardProviderHome, AuthGuardNewProviderHome, AuthGuardLogin } from '../shared/guard/auth.guard';
import { EditProfileComponent } from '../shared/modules/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from '../shared/modules/change-password/change-password.component';
import { ChangeMobileComponent } from '../shared/modules/change-mobile/change-mobile.component';
import { ChangeEmailComponent } from '../shared/modules/change-email/change-email.component';
import { InboxModule } from '../shared/modules/inbox/inbox.module';

import { WaitlistDetailResolver } from './services/waitlist-detail-resolver.service';
const routes: Routes = [
  {path: '', component: ConsumerComponent, children: [
    {path: '', component: ConsumerHomeComponent},
    {path: 'waitlist', component: WaitlistComponent, resolve: {
      waitlist_detail: WaitlistDetailResolver
    }},
    { path: 'profile', component: EditProfileComponent, canActivate: [AuthGuardLogin] },
    { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuardLogin]},
    { path: 'change-mobile', component: ChangeMobileComponent, canActivate: [AuthGuardLogin]},
    { path: 'change-email', component: ChangeEmailComponent, canActivate: [AuthGuardLogin]},
    { path: 'members', component: MembersComponent},
    {
      path: 'inbox',
      loadChildren: '../shared/modules/inbox/inbox.module#InboxModule'
    },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsumerRoutingModule {
}
