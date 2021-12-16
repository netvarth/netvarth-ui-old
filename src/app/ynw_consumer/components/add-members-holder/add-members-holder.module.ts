import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { AddMemberModule } from "../../../shared/modules/add-member/add-member.module";
import { FormMessageDisplayModule } from "../../../shared/modules/form-message-display/form-message-display.module";
import { CapitalizeFirstPipeModule } from "../../../shared/pipes/capitalize.module";
import { AddMembersHolderComponent } from "./add-members-holder.component";
import {  TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { projectConstantsLocal } from "../../../shared/constants/project-constants";

export function homeHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, projectConstantsLocal.PATH+'./assets/i18n/home/', '.json');
}
@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        CapitalizeFirstPipeModule,
        FormMessageDisplayModule,
        AddMemberModule,
        HttpClientModule,
        TranslateModule.forChild({
          loader: {
              provide: TranslateLoader,
              useFactory: homeHttpLoaderFactory,
              deps: [HttpClient]
          },
      })
    ],
    declarations: [
        AddMembersHolderComponent
    ],
    exports: [
        AddMembersHolderComponent
    ]
})
export class AddMembersHolderModule { }