import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiFactorAuthenticationComponent } from './multi-factor-authentication.component';
import { RouterModule, Routes } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: MultiFactorAuthenticationComponent }
];

@NgModule({
  declarations: [
    MultiFactorAuthenticationComponent
  ],
  imports: [
    CommonModule,
    MatSlideToggleModule,
    FormsModule,
    [RouterModule.forChild(routes)]
  ]
})

export class MultiFactorAuthenticationModule { }
