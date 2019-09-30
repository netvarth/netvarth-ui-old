import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { HomeComponent } from './shared/components/home/home.component';
import { LogoutComponent } from './shared/components/logout/logout.component';
import { AuthGuardConsumer, AuthGuardHome, AuthGuardProvider} from './shared/guard/auth.guard';
import { ReturnPaymentComponent } from './shared/components/return-payment/return-payment.component';
import { BusinessPageComponent } from './shared/components/business-page/business-page.component';
import { MaintenanceComponent } from './shared/modules/maintenance/maintenance.component';
import { AdminLoginComponent } from './shared/components/admin/login/login.component';
const routes: Routes = [
    { path: 'admin/login/:accountId/:userId', component: AdminLoginComponent},
    { path: 'provider', loadChildren: './business/business.module#BusinessModule',
        canActivate: [AuthGuardProvider]},
    { path: 'consumer', loadChildren: './ynw_consumer/consumer.module#ConsumerModule',
        canActivate: [AuthGuardConsumer]},
    { path: 'kiosk', loadChildren: './ynw_kiosk/kiosk.module#KioskModule',
        canActivate: [AuthGuardProvider]},
    { path: '', component: HomeComponent, canActivate: [AuthGuardHome]},
    { path: 'provider-home', loadChildren: './shared/components/phome/phome.module#PhomeModule'},
    { path: 'home', redirectTo: '', pathMatch: 'full', canActivate: [AuthGuardHome] },
    { path: 'logout', component: LogoutComponent },
    { path: 'not-found', loadChildren: './shared/modules/not-found/not-found.module#NotFoundModule' },
    { path: 'searchdetail', loadChildren: './shared/components/search-detail/search-detail.module#SearchDetailModule' },
    { path: 'payment-return/:id', component: ReturnPaymentComponent },
    { path: 'terms', loadChildren: './shared/modules/terms-static/terms-static.module#TermsStaticModule'},
    { path: 'provider-home/terms', loadChildren: './shared/modules/terms-static/terms-static.module#TermsStaticModule'},
    { path: 'home/:id', loadChildren: './shared/modules/about-jaldee/about-jaldee.module#AboutJaldeeModule' },
    { path: 'maintenance', component: MaintenanceComponent },
    { path: ':id', component: BusinessPageComponent},
    // { path: '**', redirectTo: 'not-found' }
];
@NgModule({
    imports: [RouterModule.forRoot(routes, {
         // preloadingStrategy: PreloadAllModules
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
