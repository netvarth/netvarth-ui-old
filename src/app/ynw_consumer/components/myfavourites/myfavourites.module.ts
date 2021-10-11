import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { RouterModule, Routes } from "@angular/router";
import { CapitalizeFirstPipeModule } from "../../../shared/pipes/capitalize.module";
import { HeaderModule } from "../../../shared/modules/header/header.module";
import { MyfavouritesComponent } from "./myfavourites.component";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { ManagePrivacyModule } from "../manage-privacy/manage-privacy.module";
import { AddInboxMessagesModule } from "../../../shared/components/add-inbox-messages/add-inbox-messages.module";
const routes: Routes = [
    { path: '', component: MyfavouritesComponent }
];
@NgModule({
    imports: [
        HeaderModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        CapitalizeFirstPipeModule,
        CommonModule,
        ManagePrivacyModule,
        AddInboxMessagesModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [
        MyfavouritesComponent
    ],
    declarations: [
        MyfavouritesComponent
    ]
})
export class MyFavouritesModule { }