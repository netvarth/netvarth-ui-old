import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TwilioService } from "src/app/shared/services/twilio-service";
import { MeetingRoomComponent } from "./meeting-room.component";

@NgModule({
    declarations: [
        MeetingRoomComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        MeetingRoomComponent
    ],
    providers: [
        TwilioService
    ]
})
export class MeetingRoomModule {}