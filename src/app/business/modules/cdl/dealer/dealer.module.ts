import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DealerComponent } from './dealer.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: DealerComponent },
  { path: 'create', loadChildren: () => import('./create-dealer/create-dealer.module').then(m => m.CreateDealerModule) },
  { path: 'approved', loadChildren: () => import('./dealer-approved/dealer-approved.module').then(m => m.DealerApprovedModule) }
]


@NgModule({
  declarations: [
    DealerComponent
  ],
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    DealerComponent
  ]
})
export class DealerModule { }
