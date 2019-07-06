import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProviderComponent } from './provider.component';
import { ProviderHomeComponent } from './components/home/provider-home.component';
import { ProviderMembersComponent } from './components/provider-members/provider-members.component';
import { ProviderbWizardComponent } from './components/provider-bwizard/provider-bwizard.component';
import { ProviderWaitlistCheckInDetailComponent } from './components/provider-waitlist-checkin-detail/provider-waitlist-checkin-detail.component';
import { ProviderCustomersComponent } from './components/provider-customers/provider-customers.component';
import { AuthGuardProviderHome, AuthGuardNewProviderHome, AuthGuardLogin } from '../shared/guard/auth.guard';
import { EditProfileComponent } from '../shared/modules/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from '../shared/modules/change-password/change-password.component';
import { ChangeMobileComponent } from '../shared/modules/change-mobile/change-mobile.component';
import { ChangeEmailComponent } from '../shared/modules/change-email/change-email.component';
import { ProviderSystemAuditLogComponent } from './components/provider-system-auditlogs/provider-system-auditlogs.component';
import { ProviderSystemAlertComponent } from './components/provider-system-alerts/provider-system-alerts.component';
import { ProviderResolver } from './services/provider-resolver.service';
import { AddProviderWaitlistCheckInBillComponent } from './components/add-provider-waitlist-checkin-bill/add-provider-waitlist-checkin-bill.component';
const routes: Routes = [
  {
    path: '', component: ProviderComponent, resolve: {terminologies: ProviderResolver},
    children: [
      { path: '', component: ProviderHomeComponent, canActivate: [AuthGuardProviderHome]},
      { path: 'checkin-detail/:id', component: ProviderWaitlistCheckInDetailComponent },
      {path: 'bill/:id', component: AddProviderWaitlistCheckInBillComponent},
      { path: 'settings', loadChildren: './components/provider-settings/provider-settings.module#ProviderSettingsModule' },
      { path: 'profile', component: EditProfileComponent, canActivate: [AuthGuardLogin] },
      { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuardLogin] },
      { path: 'change-mobile', component: ChangeMobileComponent, canActivate: [AuthGuardLogin] },
      { path: 'change-email', component: ChangeEmailComponent, canActivate: [AuthGuardLogin] },
      { path: 'members', component: ProviderMembersComponent},
      { path: 'learnmore', loadChildren: './components/learnmore/provider-learnmore.module#ProviderLearnmoreModule'},
      { path: 'customers', component: ProviderCustomersComponent },
      { path: 'inbox', loadChildren: '../shared/modules/inbox/inbox.module#InboxModule'},
      { path: 'auditlog', component: ProviderSystemAuditLogComponent},
      { path: 'alerts', component: ProviderSystemAlertComponent},
      { path: 'bwizard', component: ProviderbWizardComponent }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderRouterModule {
}
