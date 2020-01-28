import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { HomeComponent } from './shared/components/home/home.component';
import { LogoutComponent } from './shared/components/logout/logout.component';
import { AuthGuardConsumer, AuthGuardHome } from './shared/guard/auth.guard';
import { ReturnPaymentComponent } from './shared/components/return-payment/return-payment.component';
import { MaintenanceComponent } from './shared/modules/maintenance/maintenance.component';
const routes: Routes = [
         {
        path: 'consumer', loadChildren: './ynw_consumer/consumer.module#ConsumerModule',
        canActivate: [AuthGuardConsumer]
    },
    { path: '', component: HomeComponent, canActivate: [AuthGuardHome] },
      { path: 'home', redirectTo: '', pathMatch: 'full', canActivate: [AuthGuardHome] },
    { path: 'logout', component: LogoutComponent },
    { path: 'not-found', loadChildren: './shared/modules/not-found/not-found.module#NotFoundModule' },
    { path: 'searchdetail', loadChildren: './shared/components/search-detail/search-detail.module#SearchDetailModule' },
    { path: 'payment-return/:id', component: ReturnPaymentComponent },
        { path: 'maintenance', component: MaintenanceComponent }
    // { path: '**', redirectTo: 'not-found' }
];
@NgModule({
    imports: [RouterModule.forRoot(routes, {
        // preloadingStrategy: PreloadAllModules
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }

