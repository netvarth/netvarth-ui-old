import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { ShowMessagesModule } from "../../../business/modules/show-messages/show-messages.module";
import { ConfirmBoxModule } from "../../shared/component/confirm-box/confirm-box.module";
import { AddBprofileSearchAdwordsModule } from "../add-provider-bprofile-search-adwords/add-bprofile-search-adwords.module";
import { ProviderBprofileSearchAdwordsComponent } from "./provider-bprofile-search-adwords.component";

@NgModule({
    imports: [
        MatDialogModule,
        CommonModule,
        AddBprofileSearchAdwordsModule,
        ShowMessagesModule,
        ConfirmBoxModule
    ],
    exports: [ProviderBprofileSearchAdwordsComponent],
    declarations: [
        ProviderBprofileSearchAdwordsComponent
    ]
})
export class BprofileSearchAdwordsModule {}