import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CreateDealerComponent } from './create-dealer.component';
import { DropdownModule } from 'primeng/dropdown';
import { GmapsModule } from '../../gmaps/gmaps.module';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { GooglemapModule } from '../../googlemap/googlemap.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { LoadingSpinnerModule } from '../../../../../shared/modules/loading-spinner/loading-spinner.module';


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
    GmapsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    FormsModule,
    DropdownModule,
    MatIconModule,
    GooglemapModule,
    NgxMatSelectSearchModule,
    LoadingSpinnerModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    CreateDealerComponent
  ]
})
export class CreateDealerModule { }
