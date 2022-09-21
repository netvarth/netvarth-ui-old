import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoansComponent } from './loans.component';

const routes: Routes = [
  { path: '', component: LoansComponent },
  { path: 'create', loadChildren: () => import('./create/create.module').then(m => m.CreateModule) },
  { path: 'approved', loadChildren: () => import('./approved/approved.module').then(m => m.ApprovedModule) }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)]
  ]
})
export class LoansModule { }
