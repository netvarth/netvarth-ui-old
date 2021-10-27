import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardHome, AuthGuardProvider } from './shared/guard/auth.guard';
const routes: Routes = [
    {
        path: 'provider', loadChildren: () => import('./business/business.module').then(m => m.BusinessModule),
        canActivate: [AuthGuardProvider]
    },
    // { path: '', loadChildren: ()=> import('./shared/components/home-app/home-app.module').then(m=>m.HomeAppModule), canActivate: [AuthGuardHome] },
    { path: '', loadChildren: ()=> import('./shared/modules/business/login/provider-login.module').then(m=>m.ProviderLoginModule), canActivate: [AuthGuardHome] },
    { path: 'business', loadChildren: () => import('./shared/modules/business/home/phome.module').then(m => m.PhomeModule) },
    { path: 'business/terms', loadChildren: () => import('./shared/modules/terms-static/terms-static.module').then(m => m.TermsStaticModule) },
    { path: 'home', redirectTo: '', pathMatch: 'full' },
    { path: 'not-found', loadChildren: () => import('./shared/modules/not-found/not-found.module').then(m => m.NotFoundModule) },
    { path: 'displayboard/:id', loadChildren: () => import('./business/modules/displayboard-content/displayboard-content.module').then(m => m.DisplayboardLayoutContentModule)},
    { path: 'meet/:id', loadChildren: () => import('./shared/components/meet-room/meet-room.module').then(m => m.MeetRoomModule) },
    { path: 'meeting/provider/:id', loadChildren: () => import('./business/shared/meeting-room/meeting-room.module').then(m => m.MeetingRoomModule) },
    { path: 'maintenance', loadChildren: () => import('./shared/modules/maintenance/maintenance.module').then(m => m.MaintenanceModule) },
    { path: 'userchange', loadChildren: () => import('./shared/modules/user-service-change/user-service-change.module').then(m => m.UserServiceChangeModule) }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        relativeLinkResolution: 'legacy'
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
