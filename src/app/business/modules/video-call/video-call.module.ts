import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatGridListModule } from "@angular/material/grid-list";
import { RouterModule, Routes } from "@angular/router";
import { TeleBookingService } from "../../../shared/services/tele-bookings-service";
import { CapitalizeFirstPipeModule } from "../../../shared/pipes/capitalize.module";
import { VideoCallSharedComponent } from "./video-call.component";
const routes: Routes = [
    { path: '', component: VideoCallSharedComponent}
]
@NgModule({
    imports: [
        MatDialogModule,
        MatGridListModule,
        CommonModule,
        CapitalizeFirstPipeModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [VideoCallSharedComponent],
    declarations: [
        VideoCallSharedComponent
    ],
    providers: [TeleBookingService]
})
export class VideoCallModule {}