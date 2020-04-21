import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { PhomeComponent } from './phome.component';
import { AuthGuardHome } from '../../guard/auth.guard';
import { ProvidersignupComponent } from '../providersignup/providersignup.component';

const routes: Routes = [
  {path: '', component: PhomeComponent, canActivate: [AuthGuardHome]},
  
//   { path: 'jaldeepricing', loadChildren: '../../pricing/jaldeepricing/jaldeepricing.module#jaldeepricingModule' },
{
  path: '',
    children: [
      // { path: 'jaldeepricing', loadChildren: '../../../shared/components/phome/pricing/jaldeepricing.module#jaldeepricingModule' }
      { path: 'jaldeepricing', loadChildren: () => import('./pricing/jaldeepricing.module').then(m => m.jaldeepricingModule) },
      { path: 'providersignup', loadChildren: () => import('../providersignup/providersignup.module').then(m => m.ProvidersignupModule) },
     
]}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhomeRoutingModule {
}
