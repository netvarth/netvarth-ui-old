import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { DpnLetterComponent } from './dpn-letter.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', component: DpnLetterComponent }
]


@NgModule({
  declarations: [DpnLetterComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    DpnLetterComponent
  ]
})
export class DpnLetterModule { }
