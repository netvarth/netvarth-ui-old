import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CreateDealerComponent } from './create-dealer.component';
import { DropdownModule } from 'primeng/dropdown';


const routes: Routes = [
  { path: '', component: CreateDealerComponent }
]


@NgModule({
  declarations: [CreateDealerComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    DropdownModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    CreateDealerComponent
  ]
})
export class CreateDealerModule { }
