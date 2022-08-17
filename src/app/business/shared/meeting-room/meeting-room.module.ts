import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule, Routes } from "@angular/router";
import { AddInboxMessagesModule } from "../../../shared/components/add-inbox-messages/add-inbox-messages.module";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module";
import { TwilioService } from "../../../shared/services/twilio-service";
import { MeetingRoomComponent } from "./meeting-room.component";
import { RequestDialogModule } from "../../../shared/modules/request-dialog/request-dialog.module";
import { MeetService } from "../../../shared/services/meet-service";
import { MediaService } from "../../../shared/services/media-service";
import { TeleBookingService } from "../../../shared/services/tele-bookings-service";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
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
        AddInboxMessagesModule,
        RequestDialogModule,
        MatMenuModule,
        MatIconModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [
        MeetingRoomComponent
    ],
    providers: [
        TwilioService,
        MeetService,
        MediaService,
        TeleBookingService
    ]
})
export class MeetingRoomModule {}