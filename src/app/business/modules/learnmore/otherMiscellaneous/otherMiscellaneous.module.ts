import { NgModule } from "@angular/core";
import { OtherMiscellaneousComponent } from "./otherMiscellaneous.component";
import { OtherMiscellaneousRoutingModule } from "./otherMiscellaneous.routing.module";
import { SharedModule } from "../../../../shared/modules/common/shared.module";
import { HeaderModule } from "../../../../shared/modules/header/header.module";
import { BreadCrumbModule } from "../../../../shared/modules/breadcrumb/breadcrumb.module";

@NgModule({
    imports: [
        SharedModule,
        HeaderModule,
        BreadCrumbModule,
        OtherMiscellaneousRoutingModule
      ],
      declarations: [OtherMiscellaneousComponent],
      exports: [OtherMiscellaneousComponent],
      providers: []  
})
export class OtherMiscellaneousModule{

}