import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardHome } from '../../../../shared/guard/auth.guard';
import { PhomeComponent } from './phome.component';
const routes: Routes = [
  { path: '', component: PhomeComponent, canActivate: [AuthGuardHome] },
  {
    path: '',
    children: [
      { path: 'signup', loadChildren: () => import('../signup/providersignup.module').then(m => m.ProvidersignupModule) }

    ]
  }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhomeRoutingModule {
}
