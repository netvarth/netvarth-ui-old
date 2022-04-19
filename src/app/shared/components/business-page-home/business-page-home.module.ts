import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterModule, Routes } from "@angular/router";
import { DomainConfigGenerator } from "../../services/domain-config-generator.service";
import { BusinessPageHomeComponent } from "./business-page-home.component";
import { ContactModule } from "./contactus/contact.module";
import { PrivacyModule } from "./privacy/privacy.module";
import { RefundcancelModule } from "./refundcancel/refundcancel.module";
import { TermsconditionModule } from "./termscondition/termscondition.module";
const routes: Routes = [
    { path: '', component: BusinessPageHomeComponent}
];
@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule,
        ContactModule,
        PrivacyModule,
        MatDividerModule,
        MatSidenavModule,
        RefundcancelModule,
        TermsconditionModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        BusinessPageHomeComponent
    ],
    providers: [
        DomainConfigGenerator
    ]
})
export class BusinessPageHomeModule { }