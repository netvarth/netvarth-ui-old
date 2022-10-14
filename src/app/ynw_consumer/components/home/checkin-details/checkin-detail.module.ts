import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule, Routes } from "@angular/router";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { HeaderModule } from "../../../../shared/modules/header/header.module";
import { CheckinDetailComponent } from "./checkindetail.component";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { QuestionnaireModule } from "../../../../shared/components/questionnaire/questionnaire.module";
import { MatExpansionModule } from "@angular/material/expansion";
// import { InboxListModule } from "../../../../business/modules/inbox-list/inbox-list.module";
import { MatTabsModule } from "@angular/material/tabs";
import { NgxQRCodeModule } from "ngx-qrcode2";
import { AddInboxMessagesModule } from "../../../../shared/components/add-inbox-messages/add-inbox-messages.module";
import { MeetingDetailsModule } from "../../meeting-details/meeting-details.module";
import { ActionPopupModule } from "../action-popup/action-popup.module";
import { GalleryModule } from "../../../../shared/modules/gallery/gallery.module";
import { InboxListModule } from "../../../../../../src/app/shared/modules/inbox/inbox-list/inbox-list.module";
import { TeleBookingService } from "../../../../shared/services/tele-bookings-service";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import {  TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
export function homeHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, projectConstantsLocal.PATH+'assets/i18n/home/', '.json');
}
const routes: Routes = [
    { path: '', component: CheckinDetailComponent }
];
@NgModule({
    imports:[
        [RouterModule.forChild(routes)],
        MatDialogModule,
        HeaderModule,
        CommonModule,
        LoadingSpinnerModule ,
        CapitalizeFirstPipeModule,
        QuestionnaireModule,
        MatExpansionModule,
        InboxListModule,
        MatTabsModule,
        NgxQRCodeModule,
        AddInboxMessagesModule,
        MeetingDetailsModule,
        ActionPopupModule,
        GalleryModule,
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
        CheckinDetailComponent
    ],
    declarations: [
        CheckinDetailComponent
    ],
    providers: [TeleBookingService],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ],
})
export class CheckinDetailsModule {}