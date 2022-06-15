
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { CrmService } from "../crm.service";
import { RouterModule, Routes } from "@angular/router";
import { PagerModule } from "../../../../shared/modules/pager/pager.module";
import {FollowUpOneComponent} from "./followupone.component"
const routes: Routes = [
  { path: '', component: FollowUpOneComponent },
];
@NgModule({
  imports: [
      CommonModule,
      PagerModule,
      LoadingSpinnerModule,
      [RouterModule.forChild(routes)]
  ],
  exports: [FollowUpOneComponent],
  declarations: [FollowUpOneComponent],
  providers: [
    CrmService
  ]
})
export class FollowuponeModule { }
