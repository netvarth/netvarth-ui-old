import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LoadingSpinnerModule } from "../loading-spinner/loading-spinner.module";
import { TwilioService } from "../../services/twilio-service";
import { LiveChatRoutingModule } from "./live-chat-routing.module";
import { LiveChatComponent } from "./live-chat.component";

@NgModule({
    declarations: [
        LiveChatComponent
    ],
    imports: [
        CommonModule,
        LiveChatRoutingModule,
        LoadingSpinnerModule
    ],
    exports: [
        LiveChatComponent
    ],
    providers: [
        TwilioService
    ]
})
export class LiveChatModule {}