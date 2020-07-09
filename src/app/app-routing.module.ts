import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { LogoutComponent } from './shared/components/logout/logout.component';
import { AuthGuardHome, AuthGuardProvider } from './shared/guard/auth.guard';
import { ReturnPaymentComponent } from './shared/components/return-payment/return-payment.component';
import { MaintenanceComponent } from './shared/modules/maintenance/maintenance.component';
<<<<<<< HEAD
import { HomeAppComponent } from './shared/components/home-app/home-app.component';
=======
import { AdminLoginComponent } from './shared/components/admin/login/login.component';
import { ManageProviderComponent } from './shared/components/manage-provider/manage-provider.component';
import { ConsumerJoinComponent } from './ynw_consumer/components/consumer-join/join.component';
import { CheckYourStatusComponent } from './shared/components/status-check/check-status.component';
import { PaymentLinkComponent } from './shared/components/payment-link/payment-link.component';
>>>>>>> refs/remotes/origin/1.3.0
const routes: Routes = [
    {
        path: 'provider', loadChildren: () => import('./business/business.module').then(m => m.BusinessModule),
        canActivate: [AuthGuardProvider]
    },
    { path: '', component: HomeAppComponent, canActivate: [AuthGuardHome] },
    { path: 'home', redirectTo: '', pathMatch: 'full', canActivate: [AuthGuardHome] },
    { path: 'logout', component: LogoutComponent },
    { path: 'not-found', loadChildren: () => import('./shared/modules/not-found/not-found.module').then(m => m.NotFoundModule) },
    { path: 'payment-return/:id', component: ReturnPaymentComponent },
    {
        path: 'displayboard/:id', loadChildren: () => import('./business/modules/displayboard-content/displayboard-content.module').then(m => m.DisplayboardLayoutContentModule),
        canActivate: [AuthGuardProvider]
    },
<<<<<<< HEAD
    { path: 'maintenance', component: MaintenanceComponent }
=======
    { path: 'home/:id', loadChildren: () => import('./shared/modules/about-jaldee/about-jaldee.module').then(m => m.AboutJaldeeModule) },
    { path: 'maintenance', component: MaintenanceComponent },
    { path: ':id', component: BusinessPageComponent },
    { path: 'manage/:id', component: ManageProviderComponent },
    { path: 'status/:id', component: CheckYourStatusComponent },
    // { path: 'appt/status/:id', component: CheckYourStatusComponent },
      { path: 'consumer-join', component: ConsumerJoinComponent},
    { path: 'pay/:id', component: PaymentLinkComponent },
    // { path: '**', redirectTo: 'not-found' }
>>>>>>> refs/remotes/origin/1.3.0
];
@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true
        // preloadingStrategy: PreloadAllModules
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }

