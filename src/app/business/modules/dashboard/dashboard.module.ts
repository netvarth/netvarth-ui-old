import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { ProgressBarModule } from 'primeng/progressbar';
import { BookingSnippetModule } from './booking-snippet/booking-snippet.module';
import { ButtonModule } from 'primeng/button';

const routes: Routes = [
  { path: '', component: DashboardComponent }
]


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    FormsModule,
    ChartModule,
    ProgressBarModule,
    BookingSnippetModule,
    ButtonModule,
    [RouterModule.forChild(routes)]
  ]
})
export class DashboardModule { }