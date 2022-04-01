import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule, Routes } from "@angular/router";
import { HeaderModule } from "../../../../../shared/modules/header/header.module";
import { LoadingSpinnerModule } from "../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { ConfirmPageComponent } from "./confirm-page.component";
import { HttpClientModule } from '@angular/common/http';
import { FullCalendarModule } from '@fullcalendar/angular'; 
import { MatCheckboxModule } from "@angular/material/checkbox";
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction'; 
import { CalendarService } from "../../../../../../../src/app/shared/services/calendar-service";
FullCalendarModule.registerPlugins([ 
    dayGridPlugin,
    interactionPlugin
  ]);
const routes: Routes = [
    { path: '', component: ConfirmPageComponent }
];
@NgModule({
    imports:[
        [RouterModule.forChild(routes)],
        HeaderModule,
        CommonModule,
        FullCalendarModule,
        MatCheckboxModule,
        HttpClientModule,
        LoadingSpinnerModule,
        MatTooltipModule,
        FormsModule,
    ],
    exports:[ConfirmPageComponent],
    declarations:[ConfirmPageComponent],
    providers: [
        CalendarService
    ]
})
export class ConsumerApptConfirmModule{}