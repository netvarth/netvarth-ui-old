import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewDealerComponent } from './view-dealer.component';
import { RouterModule, Routes } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: ViewDealerComponent }
]


@NgModule({
  declarations: [
    ViewDealerComponent
  ],
  imports: [
    CommonModule,
    MatInputModule,
    FormsModule,
    MatSlideToggleModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    ViewDealerComponent
  ]
})
export class ViewDealerModule { }
