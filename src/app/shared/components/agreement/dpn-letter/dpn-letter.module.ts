import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DpnLetterComponent } from './dpn-letter.component';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { SignatureModule } from '../signature/signature.module';

const routes: Routes = [
  { path: '', component: DpnLetterComponent }
]

@NgModule({
  declarations: [
    DpnLetterComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    SignatureModule,
    [RouterModule.forChild(routes)]
  ]
})
export class DpnLetterModule { }
