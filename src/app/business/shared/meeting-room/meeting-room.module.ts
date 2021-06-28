import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { TwilioService } from "../../../shared/services/twilio-service";
import { MeetingRoomComponent } from "./meeting-room.component";

@NgModule({
    declarations: [
        MeetingRoomComponent
    ],
    imports: [
        CommonModule,
        MatDialogModule
    ],
    exports: [
        MeetingRoomComponent
    ],
    providers: [
        TwilioService
    ]
})
export class MeetingRoomModule {}