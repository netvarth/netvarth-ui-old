import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GmapsComponent } from './gmaps.component';
import { GMapModule } from 'primeng/gmap';


@NgModule({
  declarations: [
    GmapsComponent
  ],
  imports: [
    CommonModule,
    GMapModule
  ]
})
export class GmapsModule { }
