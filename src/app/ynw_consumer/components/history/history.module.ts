import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule, Routes } from "@angular/router";
import { RateServiceModule } from "../../../shared/components/consumer-rate-service-popup/rate-service-popup.module";
import { AddInboxMessagesModule } from "../../../shared/components/add-inbox-messages/add-inbox-messages.module";
import { CheckinPaymentModule } from "../../../shared/modules/consumer-checkin-history-list/components/checkin-payment/checkin-payment.module";
import { HeaderModule } from "../../../shared/modules/header/header.module";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module";
import { CapitalizeFirstPipeModule } from "../../../shared/pipes/capitalize.module";
import { ConsumerHistoryComponent } from "./history.component";
import { ViewRxModule } from "../home/view-rx/view-rx.module";
import { CheckInHistoryServices } from "../../../shared/modules/consumer-checkin-history-list/components/checkin-history-list/checkin-history-list.service";
const routes: Routes = [
    { path: '', component: ConsumerHistoryComponent }
];
import {  TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { projectConstantsLocal } from "../../../shared/constants/project-constants";
import { AuthenticationModule } from "../../../shared/modules/authentication/authentication.module";
import { ConsumerJoinModule } from "../consumer-join/join.component.module";
export function homeHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, projectConstantsLocal.PATH+'assets/i18n/home/', '.json');
}

@NgModule({
    imports:[
        CapitalizeFirstPipeModule,
        MatIconModule,
        MatMenuModule,
        MatTooltipModule,
        CommonModule,
        LoadingSpinnerModule,
        HeaderModule,
        MatButtonModule,
        CheckinPaymentModule,
        AddInboxMessagesModule,
        RateServiceModule,
        ViewRxModule,
        AuthenticationModule,
        ConsumerJoinModule,
        [RouterModule.forChild(routes)],
        HttpClientModule,
        TranslateModule.forChild({
          loader: {
              provide: TranslateLoader,
              useFactory: homeHttpLoaderFactory,
              deps: [HttpClient]
          },
      })
    ],
    exports:[
        ConsumerHistoryComponent
    ],
    declarations:[
        ConsumerHistoryComponent
    ],
    providers: [
        CheckInHistoryServices
    ]
})
export class ConsumerHistoryModule{}