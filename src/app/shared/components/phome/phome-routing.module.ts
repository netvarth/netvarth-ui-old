import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { PhomeComponent } from './phome.component';
import { AuthGuardHome } from '../../guard/auth.guard';

const routes: Routes = [
  {path: '', component: PhomeComponent, canActivate: [AuthGuardHome]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhomeRoutingModule {
}
