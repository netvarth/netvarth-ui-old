import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import {  MatTableModule } from "@angular/material/table";
import { CapitalizeFirstPipeModule } from "../../../../../shared/pipes/capitalize.module";
import { LoadingSpinnerModule } from "../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { CrmService } from "../../crm.service";
import { RouterModule, Routes } from "@angular/router";
import { MatTabsModule } from "@angular/material/tabs";
import { MenuModule } from "../../../../../business/home/menu/menu.module";
// import { AppointmentsComponent } from "./appointments/appointments.component";
// import { LeadActivityComponent } from "./lead-activity/lead-activity.component";
// import { ConnectionsComponent } from "./connections/connections.component";
// import { SelectAttachmentComponent } from "./select-attachment/select-attachment.component";
import { MatSliderModule } from "@angular/material/slider";
// import { ActivitylogComponent } from "./activitylog/activitylog.component";
import { NgCircleProgressModule } from "ng-circle-progress";
import { FileService } from "../../../../../shared/services/file-service";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { SelectAttachmentModule } from "../../tasks/view-task/select-attachment/select-attachment.module";
import { ViewLeadQnrComponent } from "./view-lead-qnr.component";
import { QuestionnaireModule } from "../../../../../../../src/app/shared/components/questionnaire/questionnaire.module";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatRadioModule } from "@angular/material/radio";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormMessageDisplayModule } from "../../../../../../../src/app/shared/modules/form-message-display/form-message-display.module";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatCardModule } from "@angular/material/card";
const routes: Routes = [
  { path: '', component: ViewLeadQnrComponent },
  {path:'create-lead',loadChildren:()=>import('../create-lead/create-lead.module').then((m)=>m.CreateLeadModule)},
  {path:'viewleadqnr/:id',loadChildren:()=>import('../view-lead-qnr/view-lead-qnr.module').then((m)=>m.ViewLeadQnrModule)},
  // {path:'create-task/:id',loadChildren:()=>import('../../tasks/create-task/create-task.module').then((m)=>m.CreateTaskModule)},
];

@NgModule({
  declarations: [
    ViewLeadQnrComponent,
    // AppointmentsComponent,
    // LeadActivityComponent,
    // ConnectionsComponent,
    // SubleadsComponent,
    // ActivitylogComponent,
    // SelectAttachmentComponent
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
    SelectAttachmentModule,
    MatMenuModule,
    QuestionnaireModule,
    MatIconModule,
    LoadingSpinnerModule,
        MatTooltipModule,
        MatCheckboxModule,
        FormsModule,
        CapitalizeFirstPipeModule,
        MatDialogModule,
        MatRadioModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        MatSelectModule,
        MatOptionModule,
        MatDatepickerModule,
        MatIconModule,
        // MatSelectSearchModule,
        MatCardModule,
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
export class ViewLeadQnrModule { }
