import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardConsumer, AuthGuardHome, AuthGuardProvider } from './shared/guard/auth.guard';
const routes: Routes = [
    { path: 'admin/login/:accountId/:userId', loadChildren: () => import('./shared/components/admin/login/login.module').then(m => m.AdminLoginModule) },
    {
        path: 'provider', loadChildren: () => import('./business/business.module').then(m => m.BusinessModule),
        canActivate: [AuthGuardProvider]
    },
    {
        path: 'consumer', loadChildren: () => import('./ynw_consumer/consumer.module').then(m => m.ConsumerModule),
        canActivate: [AuthGuardConsumer]
    },
    {
        path: 'customapp/:id', loadChildren: () => import('./custom-app/custom-app.module').then(m => m.CustomAppModule)
    },
    { path: '', loadChildren: ()=> import('./shared/components/home/home.module').then(m=>m.HomeModule), canActivate: [AuthGuardHome] },
    { path: 'business', loadChildren: () => import('./shared/modules/business/home/phome.module').then(m => m.PhomeModule) },
    { path: 'home', redirectTo: '', pathMatch: 'full' },
 
    { path: 'not-found', loadChildren: () => import('./shared/modules/not-found/not-found.module').then(m => m.NotFoundModule) },
    { path: 'searchdetail', loadChildren: () => import('./shared/components/search-detail/search-detail.module').then(m => m.SearchDetailModule) },
    { path: 'terms', loadChildren: () => import('./shared/modules/terms-static/terms-static.module').then(m => m.TermsStaticModule) },
    { path: 'business/terms', loadChildren: () => import('./shared/modules/terms-static/terms-static.module').then(m => m.TermsStaticModule) },
    { path: 'displayboard/:id', loadChildren: () => import('./business/modules/displayboard-content/displayboard-content.module').then(m => m.DisplayboardLayoutContentModule)},
    { path: 'meet/:id', loadChildren: () => import('./shared/components/meet-room/meet-room.module').then(m => m.MeetRoomModule) },
    { path: 'meeting/provider/:id', loadChildren: () => import('./business/shared/meeting-room/meeting-room.module').then(m => m.MeetingRoomModule) },
    { path: 'meeting/:phonenumber', loadChildren: () => import('./shared/modules/tele-home/tele-home.module').then(m => m.TeleHomeModule) },
    { path: 'maintenance', loadChildren: () => import('./shared/modules/maintenance/maintenance.module').then(m => m.MaintenanceModule) },
    { path: 'manage/:id', loadChildren: () => import('./shared/components/manage-provider/manage-provider.module').then(m => m.ManageProviderModule) },
    { path: 'status/:id', loadChildren: () => import('./shared/components/status-check/check-status.module').then(m => m.CheckStatusModule) },
    { path: 'pay/:id', loadChildren: () => import('./shared/components/payment-link/payment-link.module').then(m => m.PaymentLinkModule) },
    { path: 'order/shoppingcart', loadChildren: () => import('./shared/modules/shopping-cart/shopping-cart.module').then(m => m.ShoppingCartModule) },
    { path: 'order/shoppingcart/checkout', loadChildren: () => import('./shared/modules/shopping-cart/shopping-cart.module').then(m => m.ShoppingCartModule) },
    { path: 'userchange', loadChildren: () => import('./shared/modules/user-service-change/user-service-change.module').then(m => m.UserServiceChangeModule) },
    { path: 'order/item-details', loadChildren: () => import('./shared/components/item-details/item-details.module').then(m => m.ItemDetailsModule) },
    { path: 'questionnaire/:uid/:id/:accountId', loadChildren: () => import('./shared/components/questionnaire-link/questionnaire-link.module').then(m => m.QuestionnaireLinkModule) },
    { path: ':id', loadChildren: () => import('./shared/components/business-page/business-page.module').then(m => m.BusinessPageModule) },
    { path: ':id/department/:deptId', loadChildren: () => import('./shared/components/department-service-page/department-service-page.module').then(m => m.DepartmentServicePageModule) },
    { path: 'provideruser/:id', loadChildren: () => import('./shared/components/business-provideruser-page/business-provideruser-page.module').then(m => m.BusinessprovideruserPageModule) }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        relativeLinkResolution: 'legacy'
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
