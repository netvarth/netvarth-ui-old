import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule, Routes } from "@angular/router";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module";
import { TwilioService } from "../../../shared/services/twilio-service";
import { MeetingRoomComponent } from "./meeting-room.component";
const routes: Routes = [
    { path: '', component: MeetingRoomComponent}
]
@NgModule({
    declarations: [
        MeetingRoomComponent
    ],
    imports: [
        CommonModule,
        MatDialogModule,
        MatCheckboxModule,
        FormsModule,
        LoadingSpinnerModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [
        MeetingRoomComponent
    ],
    providers: [
        TwilioService
    ]
})
export class MeetingRoomModule {}