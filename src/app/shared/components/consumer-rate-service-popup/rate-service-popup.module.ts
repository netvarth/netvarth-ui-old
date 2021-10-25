import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ConsumerRateServicePopupComponent } from "./consumer-rate-service-popup";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { RatingStarModule } from "../../modules/ratingstar/ratingstar.module";
import { FormsModule } from "@angular/forms";
import { FormMessageDisplayModule } from "../../modules/form-message-display/form-message-display.module";
@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        RatingStarModule,
        FormsModule,
        FormMessageDisplayModule
    ],
    exports: [ConsumerRateServicePopupComponent],
    declarations: [ConsumerRateServicePopupComponent]
})
export class RateServiceModule {}