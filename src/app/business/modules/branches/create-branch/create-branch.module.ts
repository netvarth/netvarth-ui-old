import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateBranchComponent } from './create-branch.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

const routes: Routes = [
  { path: '', component: CreateBranchComponent },
];

@NgModule({
  declarations: [
    CreateBranchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
    [RouterModule.forChild(routes)]
  ]
})

export class CreateBranchModule { }
