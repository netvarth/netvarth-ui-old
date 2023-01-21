import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { SelectSchemeModule } from '../select-scheme/select-scheme.module';
import { OtpVerifyModule } from '../otp-verify/otp-verify.module';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MatIconModule } from '@angular/material/icon';

const routes: Routes = [
  { path: '', component: CreateComponent }
]


@NgModule({
  declarations: [
    CreateComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    FormsModule,
    MatExpansionModule,
    OtpVerifyModule,
    SelectSchemeModule,
    MultiSelectModule,
    CalendarModule,
    DropdownModule,
    MatIconModule,
    [RouterModule.forChild(routes)]
  ]
})
export class CreateModule { }
