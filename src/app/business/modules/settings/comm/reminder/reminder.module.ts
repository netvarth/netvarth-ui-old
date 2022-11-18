import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CapitalizeFirstPipeModule } from "../../../../../shared/pipes/capitalize.module";
import { ReminderComponent } from "./reminder.component";
import { CreateReminderComponent } from "./create-reminder/create-reminder.component";
import { NgbTimepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { MatDialogModule } from "@angular/material/dialog";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";

const routes: Routes = [{ path: "", component: ReminderComponent }];
@NgModule({
  declarations: [ReminderComponent, CreateReminderComponent],
  imports: [
    CommonModule,
    NgbModule,
    MatMenuModule,
    MatInputModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatChipsModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    CapitalizeFirstPipeModule,
    NgbTimepickerModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [ReminderComponent]
})
export class ReminderModule {}
