import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentLetterComponent } from './document-letter.component';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { SignatureModule } from '../signature/signature.module';

const routes: Routes = [
  { path: '', component: DocumentLetterComponent }
]

@NgModule({
  declarations: [
    DocumentLetterComponent
  ],
  imports: [
    CommonModule,
    CommonModule,
    MatDialogModule,
    SignatureModule,
    [RouterModule.forChild(routes)]
  ]
})
export class DocumentLetterModule { }
