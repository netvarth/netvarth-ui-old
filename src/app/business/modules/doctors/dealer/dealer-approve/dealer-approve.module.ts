import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DealerApproveComponent } from './dealer-approve.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';

const routes: Routes = [
  { path: '', component: DealerApproveComponent }
]


@NgModule({
  declarations: [
    DealerApproveComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatTooltipModule,
    MatDatepickerModule,
    CapitalizeFirstPipeModule,
    [RouterModule.forChild(routes)]
  ]
})
export class DealerApproveModule { }
