import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { DealerComponent } from './dealer.component';


const routes: Routes = [
  { path: '', component: DealerComponent },
  { path: 'create', loadChildren: () => import('./create-dealer/create-dealer.module').then(m => m.CreateDealerModule) },
  { path: 'approved', loadChildren: () => import('./dealer-approved/dealer-approved.module').then(m => m.DealerApprovedModule) },
  { path: 'view', loadChildren: () => import('./view-dealer/view-dealer.module').then(m => m.ViewDealerModule) }
]


@NgModule({
  declarations: [
    DealerComponent
  ],
  imports: [
    CommonModule,
    CapitalizeFirstPipeModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    DealerComponent
  ]
})
export class DealerModule { }
