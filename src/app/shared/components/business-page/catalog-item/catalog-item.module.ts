import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogItemComponent } from './catalog-item.component';
import { GalleryModule } from "@ks89/angular-modal-gallery";
import { RouterModule, Routes } from '@angular/router';
import { OrderService } from '../../../../shared/services/order.service';
import { HeaderModule } from '../../../../shared/modules/header/header.module';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { LoadingSpinnerModule } from '../../../../shared/modules/loading-spinner/loading-spinner.module';
import { MatDialogModule } from '@angular/material/dialog';
import { OwlModule } from 'ngx-owl-carousel';
import { ConsumerJoinModule } from '../../../../ynw_consumer/components/consumer-join/join.component.module';
import { SignupModule } from '../../signup/signup.module';
import { CardModule } from "../../card/card.module"
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
export function homeHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http,projectConstantsLocal.PATH+ 'assets/i18n/home/', '.json');
}
import { projectConstantsLocal } from "../../../constants/project-constants";



const routes: Routes = [
  { path: '', component: CatalogItemComponent}
];

@NgModule({
  declarations: [
    CatalogItemComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
    CapitalizeFirstPipeModule,
    MatDialogModule,
    ConsumerJoinModule,
    SignupModule,
    LoadingSpinnerModule,
    OwlModule,
    CardModule,
    HttpClientModule,
    GalleryModule,
    [RouterModule.forChild(routes)],
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
    CatalogItemComponent
  ],
  providers: [
    OrderService
  ]
})
export class CatalogItemModule { }
