import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationModule } from '../../shared/modules/authentication/authentication.module';
import { LoadingSpinnerModule } from '../../shared/modules/loading-spinner/loading-spinner.module';

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
    LoadingSpinnerModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    LoginComponent
  ]
})
export class LoginModule { }
