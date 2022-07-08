import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { AuthenticationModule } from '../../../../shared/modules/authentication/authentication.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: LoginComponent}
]

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    AuthenticationModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    LoginComponent
  ]
})
export class LoginModule { }
