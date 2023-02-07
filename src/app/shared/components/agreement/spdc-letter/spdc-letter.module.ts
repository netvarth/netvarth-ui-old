import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpdcLetterComponent } from './spdc-letter.component';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';

const routes: Routes = [
  { path: '', component: SpdcLetterComponent }
]

@NgModule({
  declarations: [
    SpdcLetterComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    [RouterModule.forChild(routes)]
  ]
})
export class SpdcLetterModule { }
