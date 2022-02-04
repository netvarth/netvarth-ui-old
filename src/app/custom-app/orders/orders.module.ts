import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { OrdersComponent } from "./orders.component";
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { CardModule } from "../../shared/components/card/card.module";
import { projectConstantsLocal } from "../../shared/constants/project-constants";

export function homeHttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, projectConstantsLocal.PATH + 'assets/i18n/home/', '.json');
}
@NgModule({
    imports: [
        HttpClientModule,
        CommonModule,
        CardModule,
        MatButtonModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: homeHttpLoaderFactory,
                deps: [HttpClient]
            },
            isolate: false,
            // extend: true
        }),
    ],
    exports: [
        OrdersComponent
    ],
    declarations: [
        OrdersComponent
    ]
})
export class OrdersModule { }