import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { DatePaginationComponent } from "./date-pagination.component";
import {MatCardModule} from '@angular/material/card';


@NgModule({
    imports: [
        CommonModule,
        MatDatepickerModule,
        MatCardModule,
        FormsModule
    ],
    exports: [DatePaginationComponent],
    declarations: [
        DatePaginationComponent
    ]
})
export class DatePaginationModule {}