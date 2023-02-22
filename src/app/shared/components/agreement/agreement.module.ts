import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AgreementComponent } from './agreement.component';
import { OtpVerifyModule } from './otp-verify/otp-verify.module';
import { MatDialogModule } from '@angular/material/dialog';



const routes: Routes = [
  { path: '', component: AgreementComponent },
  { path: 'dpn-letter', loadChildren: () => import('./dpn-letter/dpn-letter.module').then(m => m.DpnLetterModule) },
  { path: 'spdc-letter', loadChildren: () => import('./spdc-letter/spdc-letter.module').then(m => m.SpdcLetterModule) },
  { path: 'document-letter', loadChildren: () => import('./document-letter/document-letter.module').then(m => m.DocumentLetterModule) },
  { path: 'thank-you', loadChildren: () => import('./thank-you/thank-you.module').then(m => m.ThankYouModule) }
]


@NgModule({
  declarations: [AgreementComponent],
  imports: [
    CommonModule,
    OtpVerifyModule,
    MatDialogModule,
    [RouterModule.forChild(routes)]
  ]
})
export class AgreementModule { }
