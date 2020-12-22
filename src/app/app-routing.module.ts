import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
import { LiveChatComponent } from './shared/components/twilio/twilio-live-chat.component';
import { TwilioService } from './shared/services/twilio-service';
// import { LiveChatClientComponent } from './shared/components/twilio/twilio-live-client.component';
import { JaldeeBlogComponent } from './shared/components/jaldee-blog/jaldee-blog.component';
import { CheckoutSharedComponent } from './shared/components/checkout/checkout.component';
import { ItemDetailsSharedComponent } from './shared/components/item-details/item-details.component';
>>>>>>> refs/remotes/origin/1.7-order
const routes: Routes = [
    {
        path: 'provider', loadChildren: () => import('./business/business.module').then(m => m.BusinessModule),
        canActivate: [AuthGuardProvider]
    },
    { path: '', component: HomeAppComponent, canActivate: [AuthGuardHome] },
    { path: 'business', loadChildren: () => import('./shared/components/phome/phome.module').then(m => m.PhomeModule) },
    { path: 'home', redirectTo: '', pathMatch: 'full', canActivate: [AuthGuardHome] },
    { path: 'logout', component: LogoutComponent },
    { path: 'not-found', loadChildren: () => import('./shared/modules/not-found/not-found.module').then(m => m.NotFoundModule) },
    { path: 'payment-return/:id', component: ReturnPaymentComponent },
    {
        path: 'displayboard/:id', loadChildren: () => import('./business/modules/displayboard-content/displayboard-content.module').then(m => m.DisplayboardLayoutContentModule),
        canActivate: [AuthGuardProvider]
    },
    // { path: 'client', component: LiveChatClientComponent},
<<<<<<< HEAD
    // {path: 'video/:id',  component: LiveChatComponent},
    { path: 'maintenance', component: MaintenanceComponent }
=======
    {path: 'video/:id',  component: LiveChatComponent},
    { path: 'home/:id', loadChildren: () => import('./shared/modules/about-jaldee/about-jaldee.module').then(m => m.AboutJaldeeModule) },
    { path: 'maintenance', component: MaintenanceComponent },
    { path: 'blog', component: JaldeeBlogComponent },
    { path: ':id', component: BusinessPageComponent },
    { path: 'manage/:id', component: ManageProviderComponent },
    { path: 'status/:id', component: CheckYourStatusComponent },
    // { path: 'appt/status/:id', component: CheckYourStatusComponent },
      { path: 'consumer-join', component: ConsumerJoinComponent},
    { path: 'pay/:id', component: PaymentLinkComponent },
    { path: 'order/checkout', component: CheckoutSharedComponent },
    { path: 'order/shoppingcart', loadChildren: () => import ('./shared/modules/shopping-cart/shopping-cart.module').then(m => m.ShoppingCartModule)},
    { path: 'order/item-details', component: ItemDetailsSharedComponent}
    // { path: '**', redirectTo: 'not-found' }
>>>>>>> refs/remotes/origin/1.7-order
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        // preloadingStrategy: PreloadAllModules
    })],
    providers: [
        // TwilioService
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }