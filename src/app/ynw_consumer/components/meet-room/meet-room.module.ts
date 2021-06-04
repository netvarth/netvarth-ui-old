import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TwilioService } from "../../../shared/services/twilio-service";
import { MeetRoomComponent } from "./meet-room.component";

@NgModule({
    declarations: [
        MeetRoomComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        MeetRoomComponent
    ],
    providers: [
        TwilioService
    ]
})
export class MeetRoomModule {}