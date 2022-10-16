import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { DealerComponent } from './dealer.component';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';


const routes: Routes = [
  { path: '', component: DealerComponent },
  { path: 'create', loadChildren: () => import('./create-dealer/create-dealer.module').then(m => m.CreateDealerModule) },
  { path: 'update', loadChildren: () => import('./create-dealer/create-dealer.module').then(m => m.CreateDealerModule) },
  { path: 'approved', loadChildren: () => import('./dealer-approved/dealer-approved.module').then(m => m.DealerApprovedModule) },
  { path: 'view/:id', loadChildren: () => import('./view-dealer/view-dealer.module').then(m => m.ViewDealerModule) },
  { path: 'approve', loadChildren: () => import('./dealer-approve/dealer-approve.module').then(m => m.DealerApproveModule) },
]


@NgModule({
  declarations: [
    DealerComponent
  ],
  imports: [
    CommonModule,
    CapitalizeFirstPipeModule,
    FormsModule,
    MatTooltipModule,
    CapitalizeFirstPipeModule,
    MatDatepickerModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    DealerComponent
  ]
})
export class DealerModule { }
