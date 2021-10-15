import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { BusinessPageHomeComponent } from "./business-page-home.component";
import { BusinessPageHomeRoutingModule } from "./business-page-home.routing.module";
import { ContactComponent } from "./contactus/contact.component";
import { PrivacyComponent } from "./privacy/privacy.component";
import { RefundcancelComponent } from "./refundcancel/refundcancel.component";
import { TermsconditionComponent } from "./termscondition/termscondition.component";

@NgModule({
    imports: [
        CommonModule,
        BusinessPageHomeRoutingModule,
        MatIconModule,
        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule
    ],
    declarations: [
        BusinessPageHomeComponent,
        ContactComponent,
        TermsconditionComponent,
        PrivacyComponent,
        RefundcancelComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ],
})
export class BusinessPageHomeModule { }