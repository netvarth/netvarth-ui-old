import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {HomeComponent} from './shared/components/home/home.component';
import {LogoutComponent} from './shared/components/logout/logout.component';

import { AuthGuardConsumer, AuthGuardHome, AuthGuardProvider, AuthGuardLogin } from './shared/guard/auth.guard';
import { SearchDetailComponent } from './shared/components/search-detail/search-detail.component';
import { ProviderDetailComponent } from './shared/components/provider-detail/provider-detail.component';
import { ReturnPaymentComponent } from './shared/components/return-payment/return-payment.component';
import { ConsumerWaitlistHistoryComponent } from './shared/components/consumer-waitlist-history/consumer-waitlist-history.component';
import { TermsStaticComponent } from './shared/modules/terms-static/terms-static.component';
import { PrivacyStaticComponent } from './shared/modules/privacy-static/privacy-static.component';

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
    {
        path: 'kiosk',
        loadChildren: './ynw_kiosk/kiosk.module#KioskModule',
        canActivate: [AuthGuardProvider]
    },
    { path: '', component: HomeComponent, canActivate: [AuthGuardHome]},
    { path: 'home',   redirectTo: '', pathMatch: 'full', canActivate: [AuthGuardHome] },
    { path: 'logout',   component: LogoutComponent},
    { path: 'not-found', loadChildren: './not-found/not-found.module#NotFoundModule' },
    { path: 'searchdetail', component: SearchDetailComponent },
    { path: 'searchdetail/:id', component: ProviderDetailComponent },
    { path: 'searchdetail/:id/history', component: ConsumerWaitlistHistoryComponent },
    { path: 'payment-return/:id', component: ReturnPaymentComponent },
    { path: 'terms', component: TermsStaticComponent },
    { path: 'terms/:id', component: TermsStaticComponent },
    { path: 'privacy', component: PrivacyStaticComponent },
    { path: 'privacy/:id', component: PrivacyStaticComponent },
    { path: '**', redirectTo: 'not-found' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
