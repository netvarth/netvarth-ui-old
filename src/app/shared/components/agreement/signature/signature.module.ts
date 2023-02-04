import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignatureComponent } from './signature.component';
import { SignaturePadModule } from 'angular2-signaturepad';



@NgModule({
  declarations: [
    SignatureComponent
  ],
  imports: [
    CommonModule,
    SignaturePadModule
  ]
})
export class SignatureModule { }
