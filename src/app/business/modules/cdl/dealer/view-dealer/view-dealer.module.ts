import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewDealerComponent } from './view-dealer.component';
import { RouterModule, Routes } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ChartModule } from 'primeng/chart';

const routes: Routes = [
  { path: '', component: ViewDealerComponent }
]


@NgModule({
  declarations: [
    ViewDealerComponent
  ],
  imports: [
    CommonModule,
    MatInputModule,
    FormsModule,
    MatSlideToggleModule,
    TabViewModule,
    TableModule,
    CalendarModule,
    DropdownModule,
    InputTextModule,
    ChartModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    ViewDealerComponent
  ]
})
export class ViewDealerModule { }
