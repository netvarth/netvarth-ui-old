import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './shared/components/home/home.component';
import { LogoutComponent } from './shared/components/logout/logout.component';
import { AuthGuardConsumer, AuthGuardHome, AuthGuardProvider } from './shared/guard/auth.guard';
import { ReturnPaymentComponent } from './shared/components/return-payment/return-payment.component';
import { BusinessPageComponent } from './shared/components/business-page/business-page.component';
import { MaintenanceComponent } from './shared/modules/maintenance/maintenance.component';
import { AdminLoginComponent } from './shared/components/admin/login/login.component';
import { ManageProviderComponent } from './shared/components/manage-provider/manage-provider.component';
import { ConsumerJoinComponent } from './ynw_consumer/components/consumer-join/join.component';
import { PaymentLinkComponent } from './shared/components/payment-link/payment-link.component';
import { CheckoutSharedComponent } from './shared/components/checkout/checkout.component';
import { ItemDetailsSharedComponent } from './shared/components/item-details/item-details.component';
import { MeetingRoomComponent } from './business/shared/meeting-room/meeting-room.component';
import { MeetRoomComponent } from './shared/components/meet-room/meet-room.component';
const routes: Routes = [
    { path: 'admin/login/:accountId/:userId', component: AdminLoginComponent },
    {
        path: 'provider', loadChildren: () => import('./business/business.module').then(m => m.BusinessModule),
        canActivate: [AuthGuardProvider]
    },
    {
        path: 'consumer', loadChildren: () => import('./ynw_consumer/consumer.module').then(m => m.ConsumerModule),
        canActivate: [AuthGuardConsumer]
    },
    { path: '', component: HomeComponent, canActivate: [AuthGuardHome] },
    { path: 'business', loadChildren: () => import('./shared/modules/business/home/phome.module').then(m => m.PhomeModule) },
    { path: 'home', redirectTo: '', pathMatch: 'full' },
    { path: 'logout', component: LogoutComponent },
    { path: 'not-found', loadChildren: () => import('./shared/modules/not-found/not-found.module').then(m => m.NotFoundModule) },
    { path: 'searchdetail', loadChildren: () => import('./shared/components/search-detail/search-detail.module').then(m => m.SearchDetailModule) },
    { path: 'payment-return/:id', component: ReturnPaymentComponent },
    { path: 'terms', loadChildren: () => import('./shared/modules/terms-static/terms-static.module').then(m => m.TermsStaticModule) },
    { path: 'business/terms', loadChildren: () => import('./shared/modules/terms-static/terms-static.module').then(m => m.TermsStaticModule) },
    {
        path: 'displayboard/:id', loadChildren: () => import('./business/modules/displayboard-content/displayboard-content.module').then(m => m.DisplayboardLayoutContentModule),
    },
    { path: 'meet/:id', component: MeetRoomComponent },
    { path: 'meeting/provider/:id', component: MeetingRoomComponent },
    { path: 'meeting/:phonenumber', loadChildren: () => import('./shared/modules/tele-home/tele-home.module').then(m => m.TeleHomeModule)},
    { path: 'maintenance', component: MaintenanceComponent },
    { path: 'manage/:id', component: ManageProviderComponent },
    { path: 'status/:id', loadChildren: () => import('./shared/components/status-check/check-status.module').then(m => m.CheckStatusModule)},
    { path: 'consumer-join', component: ConsumerJoinComponent },
    { path: 'pay/:id', component: PaymentLinkComponent },
    { path: 'order/checkout', component: CheckoutSharedComponent },
    { path: 'order/shoppingcart', loadChildren: () => import('./shared/modules/shopping-cart/shopping-cart.module').then(m => m.ShoppingCartModule) },
    { path: 'order/shoppingcart/checkout', loadChildren: () => import('./shared/modules/shopping-cart/shopping-cart.module').then(m => m.ShoppingCartModule) },
    { path: 'userchange', loadChildren: () => import('./shared/modules/user-service-change/user-service-change.module').then(m => m.UserServiceChangeModule) },
    { path: 'order/item-details', component: ItemDetailsSharedComponent },
    { path: 'questionnaire/:uid/:id', loadChildren: () => import('./shared/components/questionnaire-link/questionnaire-link.module').then(m => m.QuestionnaireLinkModule) },
    { path: ':id', component: BusinessPageComponent },
    { path: ':id/home', loadChildren: () => import('./shared/components/business-page-home/business-page-home.module').then(m => m.BusinessPageHomeModule) },
    { path: ':id/:userEncId', component: BusinessPageComponent },
    { path: ':id/service/:serid', loadChildren: () => import('./shared/components/service-view/service-view.module').then(m => m.ServiceViewModule) },
    { path: ':id/:userEncId/service/:serid', loadChildren: () => import('./shared/components/service-view/service-view.module').then(m => m.ServiceViewModule) }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
    relativeLinkResolution: 'legacy'
})],
    exports: [RouterModule]
})
export class AppRoutingModule { }

