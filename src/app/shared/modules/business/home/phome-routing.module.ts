import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardHome } from '../../../../shared/guard/auth.guard';
import { PhomeComponent } from './phome.component';
const routes: Routes = [
  { path: '', component: PhomeComponent, canActivate: [AuthGuardHome] },
  {
    path: '',
    children: [
      { path: 'pricing', loadChildren: () => import('../pricing/pricing.module').then(m => m.PricingModule) },
      { path: 'signup', loadChildren: () => import('../signup/providersignup.module').then(m => m.ProvidersignupModule) },
      { path: 'login', loadChildren: () => import('../login/provider-login.module').then(m => m.ProviderLoginModule) },
      { path: 'contactus', loadChildren: () => import('../contactus/contactus.module').then(m => m.ContactusModule) },
      { path: 'aboutus', loadChildren: () => import('../about/about.module').then(m => m.AboutModule) }

    ]
  }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhomeRoutingModule {
}
