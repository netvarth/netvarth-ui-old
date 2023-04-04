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
import { TabViewModule } from 'primeng/tabview';

const routes: Routes = [
  { path: '', component: IvrComponent },
  { path: 'calls', loadChildren: () => import('./calls/calls.module').then(m => m.CallsModule) },
  { path: 'call/:id', loadChildren: () => import('./view-call/view-call.module').then(m => m.ViewCallModule) }
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
    TabViewModule,
    [RoundProgressModule],
    [RouterModule.forChild(routes)]
  ]
})
export class IvrModule { }
