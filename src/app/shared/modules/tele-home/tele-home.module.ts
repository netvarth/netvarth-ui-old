import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NgxQRCodeModule } from "ngx-qrcode2";
import { ConsumerJoinModule } from "../../../ynw_consumer/components/consumer-join/join.component.module";
import { AddInboxMessagesModule } from "../../components/add-inbox-messages/add-inbox-messages.module";
import { CapitalizeFirstPipeModule } from "../../pipes/capitalize.module";
import { LoadingSpinnerModule } from "../loading-spinner/loading-spinner.module";
import { TeleHomeRoutingModule } from "./tele-home-routing.module";
import { TeleHomeComponent } from "./tele-home.component";

@NgModule({
    declarations: [
        TeleHomeComponent
    ],
    imports: [
        CommonModule,
        TeleHomeRoutingModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        MatMenuModule,
        MatGridListModule,
        MatTooltipModule,
        MatIconModule,
        NgxQRCodeModule,
        AddInboxMessagesModule,
        ConsumerJoinModule
    ],
    exports: [
        TeleHomeComponent
    ]
})

export class TeleHomeModule {}