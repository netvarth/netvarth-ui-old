import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PrintBookingDetailsComponent } from "./print-booking-details.component";
const routes: Routes = [
    {path: '', component: PrintBookingDetailsComponent}
]
@NgModule({
    declarations: [PrintBookingDetailsComponent],
    exports: [PrintBookingDetailsComponent],
    imports: [
        CommonModule,
        [RouterModule.forChild(routes)]
    ]
})
export class PrintBookingDetailModule {}