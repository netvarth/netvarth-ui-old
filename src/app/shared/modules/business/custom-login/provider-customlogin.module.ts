import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProviderCustomLoginComponent } from './provider-customlogin.component';
import { HeaderModule } from '../../header/header.module';
import { FormMessageDisplayModule } from '../../form-message-display/form-message-display.module';
import { LoadingSpinnerModule } from '../../loading-spinner/loading-spinner.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { LoginModule } from '../../../components/login/login.module';
import { RouterModule, Routes } from '@angular/router';
import { NgOtpInputModule } from 'ng-otp-input';

const routes: Routes = [
  { path: '', component: ProviderCustomLoginComponent }
]
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HeaderModule,
    ReactiveFormsModule,
    FormMessageDisplayModule,
    LoadingSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    LoginModule,
    NgOtpInputModule,
    [RouterModule.forChild(routes)]
  ],
  declarations: [
    ProviderCustomLoginComponent
  ],
  exports: [ProviderCustomLoginComponent]
})
export class ProviderCustomLoginModule { }
