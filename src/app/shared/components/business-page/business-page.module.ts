import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { GalleryModule } from "@ks89/angular-modal-gallery";
import { Nl2BrPipeModule } from "nl2br-pipe";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module"
import { CapitalizeFirstPipeModule } from "../../pipes/capitalize.module";
import { BusinessPageComponent } from "./business-page.component";
import { CardModule } from "../card/card.module"
import { HeaderModule } from "../../../shared/modules/header/header.module";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { MatDialogModule } from "@angular/material/dialog";
import {MatDatepickerModule} from '@angular/material/datepicker';
export function homeHttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http,projectConstantsLocal.PATH+ 'assets/i18n/home/', '.json');
  }
import { AddInboxMessagesModule } from "../add-inbox-messages/add-inbox-messages.module";
import { JDNDetailModule } from "../jdn-detail/jdn-detail.module";
import { CouponsModule } from "../coupons/coupons.module";
import { ServiceDetailModule } from "../service-detail/service-detail.module";
import { ConfirmBoxModule } from "../confirm-box/confirm-box.module";
import { QRCodeGeneratordetailModule } from "../qrcodegenerator/qrcodegeneratordetail.module";
import { RouterModule, Routes } from "@angular/router";
import { CheckavailabilityModule } from "../checkavailability/checkavaiablity.module";
import { projectConstantsLocal } from "../../constants/project-constants";
import { DomainConfigGenerator } from "../../services/domain-config-generator.service";
import { AccountService } from "../../services/account.service";

const routes: Routes = [   
    { path: '', component: BusinessPageComponent},
    { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
    {path:'dashboard',loadChildren:() => import('./homedashboard/homedashboard.module').then(m => m.HomedashboardModule)},
    { path: 'home', loadChildren: () => import('../business-page-home/business-page-home.module').then(m => m.BusinessPageHomeModule) },    
    { path: 'service/:serid', loadChildren: () => import('./service-view/service-view.module').then(m => m.ServiceViewModule) },
    { path: 'service/:serid/pay/:id', loadChildren: () => import('./service-view/donation-link/donation-link.module').then(m => m.DonationLinkModule) },
    { path: 'catalog/:catalogId', loadChildren: () => import('./catalog-item/catalog-item.module').then(m => m.CatalogItemModule)},
    { path: 'catalog/:catalogId/item/:itemId', loadChildren: () => import('./catalog-item/catalog-item.module').then(m => m.CatalogItemModule) },
    { path: ':userEncId', component: BusinessPageComponent},
    { path: ':userEncId/service/:serid', loadChildren: () => import('./service-view/service-view.module').then(m => m.ServiceViewModule) },
    { path: 'submitpaper', loadChildren: () => import('../../../ynw_consumer/components/home/submit-paper/submit-paper.module').then(m => m.SubmitPaperModule) }

];
@NgModule({
    imports: [
        CommonModule,
        Nl2BrPipeModule,
        CapitalizeFirstPipeModule,
        MatTooltipModule,
        GalleryModule,
        LoadingSpinnerModule,
        CardModule,
        HeaderModule,
        MatDialogModule,
        AddInboxMessagesModule,
        JDNDetailModule,
        CouponsModule,
        ServiceDetailModule,
        ConfirmBoxModule,
        QRCodeGeneratordetailModule,
        HttpClientModule,
        MatDatepickerModule,
        CheckavailabilityModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: homeHttpLoaderFactory,
                deps: [HttpClient]
            },
            isolate: false,
            // extend: true
        }),
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        BusinessPageComponent
    ],
    providers: [
        DomainConfigGenerator,
        AccountService
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ],
    exports: [BusinessPageComponent]
})
export class BusinessPageModule {

}