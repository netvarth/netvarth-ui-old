import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PrintBookingDetailsComponent } from "./print-booking-details.component";
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { CapitalizeFirstPipeModule } from 'src/app/shared/pipes/capitalize.module';
const routes: Routes = [
    {path: '', component: PrintBookingDetailsComponent}
]
@NgModule({
    declarations: [PrintBookingDetailsComponent],
    exports: [PrintBookingDetailsComponent],
    imports: [
        CommonModule,
        NgxQRCodeModule,
        CapitalizeFirstPipeModule,
        [RouterModule.forChild(routes)]
    ]
})
export class PrintBookingDetailModule {}