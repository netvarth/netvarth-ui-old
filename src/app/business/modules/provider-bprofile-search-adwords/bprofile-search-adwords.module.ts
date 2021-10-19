import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { PagerModule } from "../../../shared/modules/pager/pager.module";
import { ShowMessagesModule } from "../../../business/modules/show-messages/show-messages.module";
import { ConfirmBoxModule } from "../../shared/confirm-box/confirm-box.module";
import { AddBprofileSearchAdwordsModule } from "../add-provider-bprofile-search-adwords/add-bprofile-search-adwords.module";
import { ProviderBprofileSearchAdwordsComponent } from "./provider-bprofile-search-adwords.component";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module";
import { MatTooltipModule } from "@angular/material/tooltip";

@NgModule({
    imports: [
        MatDialogModule,
        MatTooltipModule,
        CommonModule,
        AddBprofileSearchAdwordsModule,
        ShowMessagesModule,
        ConfirmBoxModule,
        PagerModule,
        LoadingSpinnerModule
    ],
    exports: [ProviderBprofileSearchAdwordsComponent],
    declarations: [
        ProviderBprofileSearchAdwordsComponent
    ]
})
export class BprofileSearchAdwordsModule {}