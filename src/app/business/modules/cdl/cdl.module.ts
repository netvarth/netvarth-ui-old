import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdlComponent } from './cdl.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'', component: CdlComponent},
  {path:'loans', loadChildren: () => import('./loans/loans.module').then(m => m.LoansModule) }
]

@NgModule({
  declarations: [
    CdlComponent
  ],
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    CdlComponent
  ]
})
export class CdlModule { }
