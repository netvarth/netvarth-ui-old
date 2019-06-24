import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TermsStaticComponent } from './terms-static.component';

const routes: Routes = [
  { path: '', component: TermsStaticComponent },
  {
    path: '', children: [
      { path: ':id', component: TermsStaticComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TermsRoutingModule {
}
