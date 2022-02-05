import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { RouterModule, Routes } from "@angular/router";
import { CapitalizeFirstPipeModule } from "../../../shared/pipes/capitalize.module";
import { HeaderModule } from "../../../shared/modules/header/header.module";
import { ConfirmBoxModule } from "../../shared/component/confirm-box/confirm-box.module";
import { AddMembersHolderModule } from "../add-members-holder/add-members-holder.module";
import { MembersComponent } from "./members.component";
import { MatButtonModule } from "@angular/material/button";
const routes: Routes = [
    { path: '', component: MembersComponent }
];
import {  TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { projectConstantsLocal } from "../../../shared/constants/project-constants";
export function homeHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, projectConstantsLocal.PATH+'assets/i18n/home/', '.json');
}
@NgModule({
    imports: [
        [RouterModule.forChild(routes)],
        AddMembersHolderModule,
        HeaderModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        ConfirmBoxModule,
        CapitalizeFirstPipeModule,
        CommonModule,
        HttpClientModule ,
        ConfirmBoxModule,
        TranslateModule.forChild({
          loader: {
              provide: TranslateLoader,
              useFactory: homeHttpLoaderFactory,
              deps: [HttpClient]
          },
      })
    ],
    declarations: [
        MembersComponent
    ],
    exports: [
        MembersComponent
    ]
})
export class MembersModule {}