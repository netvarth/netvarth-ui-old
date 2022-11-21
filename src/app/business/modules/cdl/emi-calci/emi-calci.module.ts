import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmiCalciComponent } from './emi-calci.component';
import { RouterModule, Routes } from '@angular/router';
import { SliderModule } from 'primeng/slider';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { ChartModule } from 'primeng/chart';

const routes: Routes = [
  { path: '', component: EmiCalciComponent }
]


@NgModule({
  declarations: [
    EmiCalciComponent
  ],
  imports: [
    CommonModule,
    SliderModule,
    InputTextModule,
    FormsModule,
    InputNumberModule,
    ChartModule,
    [RouterModule.forChild(routes)]
  ]
})
export class EmiCalciModule { }
