import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule, Routes } from "@angular/router";
import { CalendarService } from "../../../../../shared/services/calendar-service";
import { HeaderModule } from "../../../../../shared/modules/header/header.module";
import { LoadingSpinnerModule } from "../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { ConfirmPageComponent } from "./confirm-page.component";
import { HttpClientModule } from '@angular/common/http';
import { MatCheckboxModule } from "@angular/material/checkbox";
const routes: Routes = [
    { path: '', component: ConfirmPageComponent }
];
@NgModule({
    imports:[
        [RouterModule.forChild(routes)],
        HeaderModule,
        CommonModule,
        MatCheckboxModule,
        HttpClientModule,
        LoadingSpinnerModule,
        MatTooltipModule,
        FormsModule
    ],
    exports:[ConfirmPageComponent],
    declarations:[ConfirmPageComponent],
    providers: [
        CalendarService
    ]
})
export class ConsumerApptConfirmModule{}