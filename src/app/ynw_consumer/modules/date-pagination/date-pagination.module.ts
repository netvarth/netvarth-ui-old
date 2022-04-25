import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { DatePaginationComponent } from "./date-pagination.component";

@NgModule({
    imports: [
        CommonModule,
        MatDatepickerModule,
        FormsModule
    ],
    exports: [DatePaginationComponent],
    declarations: [
        DatePaginationComponent
    ]
})
export class DatePaginationModule {}