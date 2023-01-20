import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SdcLetterComponent } from './sdc-letter.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', component: SdcLetterComponent }
]


@NgModule({
  declarations: [SdcLetterComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    SdcLetterComponent
  ]
})
export class SdcLetterModule { }
