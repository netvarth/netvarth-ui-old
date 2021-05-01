import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './shared/components/home/home.component';
import { LogoutComponent } from './shared/components/logout/logout.component';
import { AuthGuardConsumer, AuthGuardHome } from './shared/guard/auth.guard';
import { ReturnPaymentComponent } from './shared/components/return-payment/return-payment.component';
import { BusinessPageComponent } from './shared/components/business-page/business-page.component';
import { MaintenanceComponent } from './shared/modules/maintenance/maintenance.component';
import { ConsumerJoinComponent } from './ynw_consumer/components/consumer-join/join.component';
import { PaymentLinkComponent } from './shared/components/payment-link/payment-link.component';
import { ItemDetailsSharedComponent } from './shared/components/item-details/item-details.component';
const routes: Routes = [
    {
        path: 'consumer', loadChildren: () => import('./ynw_consumer/consumer.module').then(m => m.ConsumerModule),
        canActivate: [AuthGuardConsumer]
    },
    { path: '', component: HomeComponent, canActivate: [AuthGuardHome] },
    { path: 'home', redirectTo: '', pathMatch: 'full', canActivate: [AuthGuardHome] },
    { path: 'logout', component: LogoutComponent },
    { path: 'not-found', loadChildren: () => import('./shared/modules/not-found/not-found.module').then(m => m.NotFoundModule) },
    { path: 'searchdetail', loadChildren: () => import('./shared/components/search-detail/search-detail.module').then(m => m.SearchDetailModule) },
    { path: 'payment-return/:id', component: ReturnPaymentComponent },
    { path: 'terms', loadChildren: () => import('./shared/modules/terms-static/terms-static.module').then(m => m.TermsStaticModule) },
    { path: 'meeting/:phonenumber', loadChildren: () => import('./shared/modules/tele-home/tele-home.module').then(m => m.TeleHomeModule)},
    { path: 'maintenance', component: MaintenanceComponent },
    { path: 'consumer-join', component: ConsumerJoinComponent },
    { path: 'pay/:id', component: PaymentLinkComponent },
    { path: 'order/item-details', component: ItemDetailsSharedComponent },
    { path: ':id', component: BusinessPageComponent },
    { path: ':id/:userEncId', component: BusinessPageComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        // preloadingStrategy: PreloadAllModules
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }

