import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CapitalizeFirstPipeModule } from "../../../shared/pipes/capitalize.module";
import { HeaderModule } from "../../../shared/modules/header/header.module";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module";
import { ConsumerHomeComponent } from "./consumer-home.component";
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { WLCardModule } from "./wl-card/wl-card.module";
import { ApptCardModule } from "./appt-card/appt-card.module";
import { RouterModule, Routes } from "@angular/router";
import { GalleryModule } from "../../../shared/modules/gallery/gallery.module";
import { AddInboxMessagesModule } from "../../../shared/components/add-inbox-messages/add-inbox-messages.module";
import { RateServiceModule } from "../../../shared/components/consumer-rate-service-popup/rate-service-popup.module";
import { MeetingDetailsModule } from "../meeting-details/meeting-details.module";
import { ViewRxModule } from "./view-rx/view-rx.module";
import { NotificationListBoxModule } from "../../shared/component/notification-list-box/notification-list-box.module";
import { AttachmentPopupModule } from "../../../shared/components/attachment-popup/attachment-popup.module";
import { CouponsModule } from "../../../shared/components/coupons/coupons.module";
const routes: Routes = [
    { path: '', component: ConsumerHomeComponent }

];
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { projectConstantsLocal } from "../../../shared/constants/project-constants";
import { SubmissionsModule } from "./submissions/submissions.module";
import { AuthenticationModule } from "../../../shared/modules/authentication/authentication.module";
import { ConsumerJoinModule } from "../consumer-join/join.component.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
export function homeHttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, projectConstantsLocal.PATH + 'assets/i18n/home/', '.json');
}
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HeaderModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        MatDialogModule,
        MatGridListModule,
        MatTooltipModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        WLCardModule,
        SubmissionsModule,
        ApptCardModule,
        GalleryModule,
        AddInboxMessagesModule,
        RateServiceModule,
        MeetingDetailsModule,
        ViewRxModule,
        MatSelectModule,
        MatOptionModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        NotificationListBoxModule,
        AttachmentPopupModule,
        CouponsModule,
        AuthenticationModule,
        ConsumerJoinModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
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
    exports: [ConsumerHomeComponent],
    declarations: [
        ConsumerHomeComponent
    ]
})
export class ConsumerHomeModule { }