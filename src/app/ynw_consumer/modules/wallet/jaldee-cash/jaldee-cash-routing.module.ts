import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JaldeeCashComponent } from './jaldee-cash.component';

const routes: Routes = [
  {path:'', component: JaldeeCashComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JaldeeCashRoutingModule { }
