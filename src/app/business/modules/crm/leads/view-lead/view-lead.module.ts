import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import {  MatTableModule } from "@angular/material/table";
import { CapitalizeFirstPipeModule } from "../../../../../shared/pipes/capitalize.module";
import { LoadingSpinnerModule } from "../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { CrmService } from "../../crm.service";
import { RouterModule, Routes } from "@angular/router";
import { MatTabsModule } from "@angular/material/tabs";
import { ViewLeadComponent } from "./view-lead.component";
import { MenuModule } from "../../../../../business/home/menu/menu.module";
import { AppointmentsComponent } from "./appointments/appointments.component";
import { LeadActivityComponent } from "./lead-activity/lead-activity.component";
import { ConnectionsComponent } from "./connections/connections.component";
import { SubleadsComponent } from "./subleads/subleads.component";
import { SelectAttachmentComponent } from "./select-attachment/select-attachment.component";
import { MatSliderModule } from "@angular/material/slider";
import { ActivitylogComponent } from "./activitylog/activitylog.component";
import { NgCircleProgressModule } from "ng-circle-progress";
import { FileService } from "../../../../../shared/services/file-service";
const routes: Routes = [
  { path: '', component: ViewLeadComponent },
  {path:'create-lead',loadChildren:()=>import('../create-lead/create-lead.module').then((m)=>m.CreateLeadModule)},
  {path:'viewlead/:id',loadChildren:()=>import('../view-lead/view-lead.module').then((m)=>m.ViewLeadModule)},
];

@NgModule({
  declarations: [
    ViewLeadComponent,
    AppointmentsComponent,
    LeadActivityComponent,
    ConnectionsComponent,
    SubleadsComponent,
    ActivitylogComponent,
    SelectAttachmentComponent
  ],
  imports: [
    CommonModule,
    LoadingSpinnerModule,
    MatTableModule,
    MatDialogModule,
    MatTabsModule,
    CapitalizeFirstPipeModule,
    MenuModule,
    MatSliderModule,
    LoadingSpinnerModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      backgroundColor: "#e9ecef",
      backgroundPadding: 0,
      radius: 30,
      space: -15,
      maxPercent: 100,
      unitsColor: "teal",
      outerStrokeWidth: 1,
      outerStrokeColor: "teal",
      innerStrokeColor: "teal",
      innerStrokeWidth: 1,
      titleColor: "teal",
      subtitleColor: "teal",
    }),
    [RouterModule.forChild(routes)],
    
  ],
  providers: [
    CrmService,
    FileService
  ],
  schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
      NO_ERRORS_SCHEMA
  ]
})
export class ViewLeadModule { }
