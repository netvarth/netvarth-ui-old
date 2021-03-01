import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogoutComponent } from './shared/components/logout/logout.component';
import { AuthGuardHome, AuthGuardProvider } from './shared/guard/auth.guard';
import { ReturnPaymentComponent } from './shared/components/return-payment/return-payment.component';
import { MaintenanceComponent } from './shared/modules/maintenance/maintenance.component';
import { HomeAppComponent } from './shared/components/home-app/home-app.component';
import { TwilioService } from './shared/services/twilio-service';
import { LiveChatComponent } from './shared/components/twilio/twilio-live-chat.component';
const routes: Routes = [
    {
        path: 'provider', loadChildren: () => import('./business/business.module').then(m => m.BusinessModule),
        canActivate: [AuthGuardProvider]
    },
    { path: '', component: HomeAppComponent, canActivate: [AuthGuardHome] },
    { path: 'business', loadChildren: () => import('./shared/modules/business/home/phome.module').then(m => m.PhomeModule) },
    { path: 'home', redirectTo: '', pathMatch: 'full', canActivate: [AuthGuardHome] },
    { path: 'logout', component: LogoutComponent },
    { path: 'not-found', loadChildren: () => import('./shared/modules/not-found/not-found.module').then(m => m.NotFoundModule) },
    { path: 'payment-return/:id', component: ReturnPaymentComponent },
    {
        path: 'displayboard/:id', loadChildren: () => import('./business/modules/displayboard-content/displayboard-content.module').then(m => m.DisplayboardLayoutContentModule),
        // canActivate: [AuthGuardProvider]
    },
    // { path: 'client', component: LiveChatClientComponent},
    {path: 'video/:id',  component: LiveChatComponent},
<<<<<<< HEAD
    { path: 'maintenance', component: MaintenanceComponent }
=======
    { path: 'home/:id', loadChildren: () => import('./shared/modules/about-jaldee/about-jaldee.module').then(m => m.AboutJaldeeModule) },
    { path: 'maintenance', component: MaintenanceComponent },
    { path: 'blog', component: JaldeeBlogComponent },
    { path: 'manage/:id', component: ManageProviderComponent },
    { path: 'status/:id', component: CheckYourStatusComponent },
    // { path: 'appt/status/:id', component: CheckYourStatusComponent },
      { path: 'consumer-join', component: ConsumerJoinComponent},
    { path: 'pay/:id', component: PaymentLinkComponent },
    { path: 'order/checkout', component: CheckoutSharedComponent },
    { path: 'order/shoppingcart', loadChildren: () => import ('./shared/modules/shopping-cart/shopping-cart.module').then(m => m.ShoppingCartModule)},
    { path: 'order/shoppingcart/checkout', loadChildren: () => import ('./shared/modules/shopping-cart/shopping-cart.module').then(m => m.ShoppingCartModule)},
    { path: 'order/item-details', component: ItemDetailsSharedComponent},
    { path: ':id', component: BusinessPageComponent },
    { path: ':id/:userEncId', component: BusinessPageComponent}
    // { path: '**', redirectTo: 'not-found' }
>>>>>>> refs/remotes/origin/1.7-order
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        // preloadingStrategy: PreloadAllModules
    })],
    providers: [
        TwilioService
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }

