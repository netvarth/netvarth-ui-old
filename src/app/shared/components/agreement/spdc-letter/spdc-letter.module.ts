import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpdcLetterComponent } from './spdc-letter.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: SpdcLetterComponent }
]

@NgModule({
  declarations: [
    SpdcLetterComponent
  ],
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)]
  ]
})
export class SpdcLetterModule { }
