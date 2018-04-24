import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {HomeComponent} from './shared/components/home/home.component';
import {LogoutComponent} from './shared/components/logout/logout.component';

import { AuthGuardConsumer, AuthGuardHome, AuthGuardProvider, AuthGuardLogin } from './shared/guard/auth.guard';
import { SearchDetailComponent } from './shared/components/search-detail/search-detail.component';
import { ProviderDetailComponent } from './shared/components/provider-detail/provider-detail.component';
// import {EditProfileComponent } from './shared/components/edit-profile/edit-profile.component';
// import {ChangePasswordComponent} from './shared/components/change-password/change-password.component';
// import { ChangeMobileComponent } from './shared/components/change-mobile/change-mobile.component';
// import { ChangeEmailComponent } from './shared/components/change-email/change-email.component';

const routes: Routes = [
    {
        path: 'provider',
        loadChildren: './ynw_provider/provider.module#ProviderModule',
        canActivate: [AuthGuardProvider]
    },
    {
        path: 'consumer',
        loadChildren: './ynw_consumer/consumer.module#ConsumerModule',
        canActivate: [AuthGuardConsumer]
    },
    { path: '', component: HomeComponent, canActivate: [AuthGuardHome]},
    { path: 'home',   redirectTo: '', pathMatch: 'full', canActivate: [AuthGuardHome] },
    { path: 'logout',   component: LogoutComponent},
    { path: 'not-found', loadChildren: './not-found/not-found.module#NotFoundModule' },
    { path: 'searchdetail', component: SearchDetailComponent },
    { path: 'searchdetail/:id', component: ProviderDetailComponent },
   // { path: 'profile', component: EditProfileComponent, canActivate: [AuthGuardLogin]},
    // { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuardLogin]},
   // { path: 'change-mobile', component: ChangeMobileComponent, canActivate: [AuthGuardLogin]},
   // { path: 'change-email', component: ChangeEmailComponent, canActivate: [AuthGuardLogin]},
    { path: '**', redirectTo: 'not-found' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
