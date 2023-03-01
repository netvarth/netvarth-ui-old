import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IvrComponent } from './ivr.component';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import { MatMenuModule } from '@angular/material/menu';
import { RoundProgressModule } from 'angular-svg-round-progressbar';

const routes: Routes = [
  { path: '', component: IvrComponent }
]

@NgModule({
  declarations: [
    IvrComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    CalendarModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    ChartModule,
    MenuModule,
    RippleModule,
    MatMenuModule,
    [RoundProgressModule],
    [RouterModule.forChild(routes)]
  ]
})
export class IvrModule { }
