import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogoutComponent } from './shared/components/logout/logout.component';
import { AuthGuardHome, AuthGuardProvider } from './shared/guard/auth.guard';
import { ReturnPaymentComponent } from './shared/components/return-payment/return-payment.component';
import { MaintenanceComponent } from './shared/modules/maintenance/maintenance.component';
import { HomeAppComponent } from './shared/components/home-app/home-app.component';
import { TwilioService } from './shared/services/twilio-service';
import { MeetingRoomComponent } from './business/shared/meeting-room/meeting-room.component';
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
    // {path: 'video/:id',  component: LiveChatComponent},
    {path: 'meeting/provider/:id', component: MeetingRoomComponent}, 
    { path: 'maintenance', component: MaintenanceComponent }
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

