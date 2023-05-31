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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SchedulesModule } from './schedules/schedules.module';

const routes: Routes = [
  { path: '', component: IvrComponent },
  { path: 'calls', loadChildren: () => import('./calls/calls.module').then(m => m.CallsModule) },
  { path: 'call/:id', loadChildren: () => import('./view-call/view-call.module').then(m => m.ViewCallModule) },
  { path: 'details-collect/:id', loadChildren: () => import('./details-collect/details-collect.module').then(m => m.DetailsCollectModule) },
  { path: 'details/:id', loadChildren: () => import('./details-collect/details-collect.module').then(m => m.DetailsCollectModule) }
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
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ChartModule,
    MenuModule,
    RippleModule,
    MatMenuModule,
    TabViewModule,
    SchedulesModule,
    [RoundProgressModule],
    [RouterModule.forChild(routes)]
  ]
})
export class IvrModule { }
