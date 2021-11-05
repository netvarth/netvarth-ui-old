import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CustTemplatesModule } from "../templates/cust-templates.module";
import { CustomAppComponent } from "./custom-app.component";
import { CustomAppRoutingModule } from "./custom-app.routing.module";

@NgModule({
    declarations: [
        CustomAppComponent
    ],
    imports: [
        CommonModule,
        CustomAppRoutingModule,
        CustTemplatesModule
    ],
    exports: [CustomAppComponent]
})
export class CustomAppModule{}
