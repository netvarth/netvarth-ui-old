import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LoadingSpinnerModule } from "../loading-spinner/loading-spinner.module";
import { TwilioService } from "../../services/twilio-service";
import { LiveChatRoutingModule } from "./live-chat-routing.module";
import { LiveChatComponent } from "./live-chat.component";
import { RequestDialogModule } from "../request-dialog/request-dialog.module";
import { MeetService } from "../../services/meet-service";
import { MediaService } from "../../services/media-service";
import { TeleBookingService } from "../../services/tele-bookings-service";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";

@NgModule({
    declarations: [
        LiveChatComponent
    ],
    imports: [
        CommonModule,
        LiveChatRoutingModule,
        RequestDialogModule,
        LoadingSpinnerModule,
        MatMenuModule,
        MatIconModule
    ],
    exports: [
        LiveChatComponent
    ],
    providers: [
        TwilioService,
        MeetService,
        MediaService,
        TeleBookingService
    ]
})
export class LiveChatModule {}