import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { PhomeComponent } from './phome.component';
import { AuthGuardHome } from '../../guard/auth.guard';

const routes: Routes = [
  {path: '', component: PhomeComponent, canActivate: [AuthGuardHome]},

//   { path: 'jaldeepricing', loadChildren: '../../pricing/jaldeepricing/jaldeepricing.module#jaldeepricingModule' },
{
  path: '',
    children: [
      { path: 'jaldeepricing', loadChildren: '../../../shared/components/phome/pricing/jaldeepricing.module#jaldeepricingModule' }
    ]}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhomeRoutingModule {
}
